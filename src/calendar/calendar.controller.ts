import { Controller, Post, Get } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('/google-calendar')
export class CalendarController {
  constructor(private readonly googleCalendarService: CalendarService) {}

  @Post('/sync-events')
  async syncEventsToGoogleCalendar(): Promise<any> {
    return this.googleCalendarService.syncGoogleCalendarEvents();
  }

  @Get('/get-schedule')
  async getAllSchedule(): Promise<any> {
    return this.googleCalendarService.getSchedules();
  }
}
