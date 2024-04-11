import { Injectable, Logger } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client, GoogleAuth } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';
@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
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
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
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

  async listNext10Events(): Promise<void> {
    const res = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      this.logger.log('No upcoming events found.');
      return;
    }
    this.logger.log('Upcoming 10 events:');
    events.forEach((event) => {
      const start = event.start.dateTime || event.start.date;
      this.logger.log(`${start} - ${event.summary}`);
    });
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
      console.log('event id: ', eventId);
      console.log('event: ', event);

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
}
