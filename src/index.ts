import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { CalendarService } from './calendar/calendar.service';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  return app.init();
};

createNestServer(server)
  .then(() => console.log('Nest ready'))
  .catch((err) => console.log('Nest broken', err));

export const api = functions.https.onRequest(server);
export const syncEventsToGoogleCalendar = functions.pubsub
  .schedule('*/1 * * * *')
  .onRun(async () => {
    console.log(
      'Scheduled function to sync events to Google Calendar is running',
    );
    const nestApp = await NestFactory.createApplicationContext(AppModule);
    const calendarService = nestApp.get(CalendarService);
    try {
      await calendarService.syncGoogleCalendarEvents();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Error during sync:', error);
    }
    await nestApp.close();
  });
