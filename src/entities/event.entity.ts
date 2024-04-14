export class Event {
  summary: string;
  description: string;
  start_datetime: Date;
  end_datetime: Date;
  time_zone: string;
  status: StatusType = StatusType.insert;
  attendees?: string[];
}
enum StatusType {
  insert = 'insert',
  update = 'update',
  cancel = 'cancel',
}
