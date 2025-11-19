import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCliente: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ length: 25 })
  marca: string;

  @Column({ length: 25 })
  modelo: string;

  @Column()
  idCategoria: number;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
