import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('calendar_events')
export class Event {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: number;

  @Column({ length: 255 })
  user_name: string;

  @Column({ length: 255 })
  user_email: string;

  @Column({ length: 255 })
  summary: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('timestamp with time zone')
  start_datetime: Date;

  @Column('timestamp with time zone')
  end_datetime: Date;

  @Column({ length: 50 })
  time_zone: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
