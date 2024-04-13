import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
