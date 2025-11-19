import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'idcategoria' })
  idcategoria: number;

  @Column({ length: 22 })
  descripcion: string;
}
