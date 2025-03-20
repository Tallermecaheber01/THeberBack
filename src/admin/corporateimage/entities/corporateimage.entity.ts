import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'corporateimage' })
export class CorporateImage {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'varchar', length: 2000 })
  descripcion: string;
}
