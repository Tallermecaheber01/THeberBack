import { ViewEntity, Column } from 'typeorm';

@ViewEntity('view_appointments_pending_change')
export class AppointmentPendingChangeViewEntity {
  @Column()
  appointment_id: number;

  @Column()
  cliente_id: number;

  @Column()
  nombreCliente: string;

  @Column()
  fecha: string;

  @Column()
  hora: string;

  @Column()
  total: number;

  @Column({ nullable: true })
  costoExtra: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  estado: string;

  @Column()
  servicio: string;

  @Column()
  costo: number;
}
