import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'security_policy' })
export class SecurityPolicyEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  info: string;
}