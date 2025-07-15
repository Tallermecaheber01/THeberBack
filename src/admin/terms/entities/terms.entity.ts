import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'terms' })
export class TermsEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  info: string;
}