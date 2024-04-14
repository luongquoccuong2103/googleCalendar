export class Event {
  id: number;
  summary: string;
  description: string;
  start_datetime: Date;
  end_datetime: Date;
  time_zone: string;
  attendees?: string[];
}
