import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusType } from 'src/entities/event.entity';
import { PartialType } from '@nestjs/mapped-types';
export class CreateEventDto {
  @IsString()
  summary: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  description: string;

  @IsString()
  start_datetime: string;

  @IsString()
  end_datetime: string;

  @IsString()
  time_zone: string;

  @IsEnum(StatusType)
  status: StatusType = StatusType.insert;

  @IsString({ each: true })
  @IsOptional()
  attendees?: string[];
}

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsString()
  @IsOptional()
  googleCalendarEventId?: string;
}
