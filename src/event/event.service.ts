import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/core/firestore.service';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(private firebaseService: FirebaseService) {}

  async getAllEvents(): Promise<any[]> {
    return this.firebaseService.getAllData('event');
  }

  async findOneWithEventName(userName: string) {
    const events = await this.firebaseService.getAllData('event');
    return events.find((user) => user.email === userName);
  }

  async create(createEventDto: CreateEventDto) {
    const start_datetime = new Date(createEventDto.start_datetime);
    const end_datetime = new Date(createEventDto.end_datetime);
    if (isNaN(start_datetime.getTime()) || isNaN(end_datetime.getTime())) {
      throw new Error('Invalid date format');
    }

    const newEvent = await this.firebaseService.add('event', createEventDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newEvent;
    return result;
  }

  async update(id: string, updateEventDto: any) {
    return await this.firebaseService.update('event', id, updateEventDto);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.firebaseService.delete('event', id);
  }
}
