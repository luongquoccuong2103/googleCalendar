export class Event {
  googleCalendarEventId: string;
  summary: string;
  location: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  time_zone: string;
  status: StatusType = StatusType.insert;
  attendees?: string[];
}
export enum StatusType {
  insert = 'insert',
  update = 'update',
  cancel = 'cancel',
  synced = 'synced',
}
