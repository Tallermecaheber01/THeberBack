import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'demarcation' })
export class DemarcationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  info: string;
}