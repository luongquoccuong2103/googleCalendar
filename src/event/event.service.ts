import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/core/firestore.service';

@Injectable()
export class EventService {
  constructor(private firebaseService: FirebaseService) {}

  async getAllEvents(): Promise<any[]> {
    return this.firebaseService.getAllData('event');
  }

  async findOneWithEventrName(userName: string) {
    const users = await this.firebaseService.getAllData('event');
    return users.find((user) => user.email === userName);
  }

  async create(createEventDto: any) {
    const newUser = await this.firebaseService.add('event', createEventDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return result;
  }

  async update(id: string, updateEventDto: any) {
    return await this.firebaseService.update('event', id, updateEventDto);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.firebaseService.delete('event', id);
  }
}
