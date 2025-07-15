import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

export type ReminderType = 'TWO_DAYS' | 'ONE_DAY' | 'FOUR_HOURS';

@Entity({ name: 'appointment_reminder' })
@Index('IDX_appointment_reminder_appointment_type', ['appointmentId', 'type'])
export class AppointmentReminderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AppointmentEntity, appointment => appointment.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointmentId' })
  appointment: AppointmentEntity;

  @Column()
  appointmentId: number;

  @Column({ type: 'varchar', length: 20 })
  type: ReminderType;

  @CreateDateColumn({ type: 'timestamp' })
  sentAt: Date;
}
