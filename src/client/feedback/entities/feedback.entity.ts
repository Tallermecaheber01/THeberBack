import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'feedback' })
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  servicio: string;

  @Column({ type: 'int' })
  calificacion: number;

  @Column({ type: 'text' })
  comentario: string;
}