import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtGuard)
  @Get('/getAllEvents')
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateEvent(@Param('id') id: string, @Body() eventData: Event) {
    return this.eventService.update(id, eventData);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
