import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  servicio: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  idCliente: number;

  @Column('date')
  fecha: string; // o Date si prefieres

  @Column('time')
  hora: string; // o Date si prefieres

  @Column({
    type: 'enum',
    enum: ['Mercado Pago', 'Efectivo'],
  })
  formaPago: 'Mercado Pago' | 'Efectivo';
}
