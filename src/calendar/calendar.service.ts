import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client, GoogleAuth } from 'google-auth-library';
import { FirebaseService } from '../core/firestore.service';
import { StatusType } from './../entities/event.entity';
import { ILoggerService } from './../logger/adapter';
@Injectable()
export class CalendarService {
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar',
  ];
  private readonly TOKEN_PATH = path.join(process.cwd(), 'token.json');
  private readonly CREDENTIALS_PATH = path.join(
    process.cwd(),
    'credentials.json',
  );

  private calendar: calendar_v3.Calendar;

  constructor(
    private readonly logger: ILoggerService,
    private firebaseService: FirebaseService,
  ) {
    this.initialize();
  }

  private async initialize() {
    const auth = await this.authorize();
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  private async loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
      const content = await fsPromises.readFile(this.TOKEN_PATH);
      const credentials = JSON.parse(content.toString());
      const auth = new GoogleAuth({
        scopes: this.SCOPES,
        credentials: credentials,
      });
      const client = await auth.getClient();

      if (client instanceof OAuth2Client) {
        return client;
      } else {
        this.logger.error('Client is not an instance of OAuth2Client');
        return null;
      }
    } catch (err) {
      this.logger.error('Error loading credentials:', err);
      return null;
    }
  }

  private async saveCredentials(client: OAuth2Client): Promise<void> {
    const content = await fsPromises.readFile(this.CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fsPromises.writeFile(this.TOKEN_PATH, payload);
  }

  private async authorize(): Promise<OAuth2Client> {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  async createEvent(
    event: calendar_v3.Schema$Event,
  ): Promise<calendar_v3.Schema$Event | null> {
    try {
      const result = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendNotifications: true,
      });
      this.logger.log(`Event created: ${result.data.htmlLink}`);
      return result.data;
    } catch (err) {
      this.logger.error(
        'There was an error contacting the Calendar service: ',
        err,
      );
      return null;
    }
  }

  async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event,
  ): Promise<calendar_v3.Schema$Event | null> {
    try {
      const result = await this.calendar.events.update({
        eventId: eventId,
        calendarId: 'primary',
        requestBody: event,
        sendNotifications: true,
      });
      this.logger.log(`Event updated: ${result.data.htmlLink}`);
      return result.data;
    } catch (err) {
      this.logger.error(
        'There was an error contacting the Calendar service: ',
        err,
      );
      return null;
    }
  }

  async getSchedules() {
    try {
      const result = await this.calendar.events.list({
        calendarId: 'primary',
      });
      return result.data;
    } catch (err) {
      this.logger.error(
        'There was an error contacting the Calendar service: ',
        err,
      );
      return null;
    }
  }

  private mapToGoogleCalendarEvent(event: any): calendar_v3.Schema$Event {
    console.log('event: ', event);
    const startDateTime = new Date(event.start_datetime);
    const endDateTime = new Date(event.end_datetime);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new Error('Invalid date format');
    }
    return {
      summary: event.summary,
      location: event.location,
      description: event.description,
      start: {
        dateTime: event.start_datetime,
        timeZone: event.time_zone,
      },
      end: {
        dateTime: event.end_datetime,
        timeZone: event.time_zone,
      },
      attendees: event.attendees?.map((email) => ({ email })),
    };
  }

  private async handleNewEvent(event: any): Promise<void> {
    const googleCalendarEvent = this.mapToGoogleCalendarEvent(event);

    const createdEvent = await this.createEvent(googleCalendarEvent);
    if (createdEvent) {
      await this.firebaseService.update('event', event.id, {
        googleCalendarEventId: createdEvent.id,
        status: StatusType.synced,
      });
    }
  }

  async handleUpdateEvent(event: any) {
    if (!event.googleCalendarEventId) {
      console.log(
        `Event ${event.id} is missing googleCalendarEventId and cannot be updated.`,
      );
      return;
    }

    const googleCalendarEvent = this.mapToGoogleCalendarEvent(event);

    try {
      const updatedEvent = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: event.googleCalendarEventId,
        requestBody: googleCalendarEvent,
      });
      console.log(`Event updated: ${updatedEvent.data.htmlLink}`);

      await this.firebaseService.update('event', event.id, {
        status: StatusType.synced,
      });
    } catch (error) {
      console.error(
        `Failed to update event ${event.id} on Google Calendar`,
        error,
      );
    }
  }

  async handleCancelEvent(event: any) {
    if (!event.googleCalendarEventId) {
      console.log(
        `Event ${event.id} is missing googleCalendarEventId and cannot be canceled.`,
      );
      return;
    }

    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: event.googleCalendarEventId,
      });
      console.log(`Event ${event.id} canceled on Google Calendar.`);

      await this.firebaseService.update('event', event.id, {
        status: StatusType.synced,
      });
    } catch (error) {
      console.error(
        `Failed to cancel event ${event.id} on Google Calendar`,
        error,
      );
    }
  }

  async syncGoogleCalendarEvents(): Promise<any> {
    const events = await this.firebaseService.getAllData('event');
    console.log('cronjob start');
    for (const event of events) {
      switch (event.status) {
        case StatusType.insert:
          await this.handleNewEvent(event);
          break;
        case StatusType.update:
          await this.handleUpdateEvent(event);
          break;
        case StatusType.cancel:
          await this.handleCancelEvent(event);
          break;
      }
    }
    console.log('cronjob end');
  }
}
