import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'contacts' })
export class Contact {
  @PrimaryGeneratedColumn({ name: 'idContactos' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 300 })
  informacion: string;
}
