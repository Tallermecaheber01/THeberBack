import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('appointmentcancellations')
export class AppointmentCancellation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCita: number;

  @Column({
    type: 'enum',
    enum: ['Cliente', 'Empleado', 'Administrador'],
  })
  canceladoPor: 'Cliente' | 'Empleado' | 'Administrador';

  @Column('text')
  motivo: string;

  @CreateDateColumn({ name: 'canceladoEn' })
  canceladoEn: Date;
}
