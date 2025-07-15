import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('appointment')
export class AppointmentClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costoExtra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'varchar', length: 100 })
  marca: string;

  @Column({ type: 'varchar', length: 100 })
  modelo: string;

  @Column({
    type: 'enum',
    enum: [
      'En espera',
      'Confirmada',
      'Pendiente de cambio',
      'Reprogramada',
      'Rechazada',
      'Cancelada',
      'Asignada',
      'Finalizada',
    ],
    default: 'En espera',
  })
  estado: string;

  @Column()
  IdCliente: number;

  @Column({ nullable: true })
  IdPersonal: number;
}
