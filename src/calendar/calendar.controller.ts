import { Controller, Post, Body, Get } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { calendar_v3 } from 'googleapis';

const event = {
  summary: 'Google I/O 2015',
  location: '800 Howard St., San Francisco, CA 94103',
  description: "A chance to hear more about Google's developer products.",
  start: {
    dateTime: '2024-04-28T09:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2024-04-28T17:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  attendees: [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }],
};

@Controller('/events')
export class CalendarController {
  constructor(private readonly googleCalendarService: CalendarService) {}

  @Post('/create')
  async addEvent(@Body() eventData: any): Promise<any> {
    eventData = event;
    return this.googleCalendarService.createEvent(eventData);
  }

  @Post('/update')
  async updateEvent(
    @Body() data: { calendarId: string; eventData: calendar_v3.Schema$Event },
  ): Promise<any> {
    return this.googleCalendarService.updateEvent(
      data.calendarId,
      data.eventData,
    );
  }

  @Get('/get-schedule')
  async getAllSchedule(): Promise<any> {
    return this.googleCalendarService.getSchedules();
  }
}
