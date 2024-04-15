import { Controller, Post, Get, Logger } from '@nestjs/common';
import { CalendarService } from './calendar.service';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { functions } from 'firebase-functions';
@Controller('/google-calendar')
export class CalendarController {
  private readonly logger = new Logger(CalendarService.name);
  constructor(private readonly googleCalendarService: CalendarService) {}

  // @Cron(CronExpression.EVERY_SECOND)
  // async syncGoogleCalendarEvents() {
  //   this.logger.debug('Starting Google Calendar sync...');
  //   // Thêm logic của bạn ở đây để đồng bộ hóa sự kiện từ Firestore sang Google Calendar
  // }

  @Post('/sync-events')
  async syncEventsToGoogleCalendar(): Promise<any> {
    return this.googleCalendarService.syncGoogleCalendarEvents();
  }

  @Get('/get-schedule')
  async getAllSchedule(): Promise<any> {
    return this.googleCalendarService.getSchedules();
  }
}
