import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('appointmentservices')
export class AppointmentServiceClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCita: number;

  @Column({ type: 'varchar', length: 255 })
  servicio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;
}
