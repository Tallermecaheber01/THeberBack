import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PoliceEstado {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

@Entity({ name: 'polices' })
export class Police {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 10000})
  descripcion: string;

  @Column({ type: 'datetime' })
  fecha: Date;

  @Column({ type: 'enum', enum: PoliceEstado })
  estado: PoliceEstado;
}
