import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateEventDto } from './dto/event.dto';

@UseGuards(JwtGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/getAllEvents')
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Post('/create')
  createEvent(@Body(ValidationPipe) createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Put('/update/:id')
  updateEvent(@Param('id') id: string, @Body() eventData: Event) {
    return this.eventService.update(id, eventData);
  }

  @Delete('/delete/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
