import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity'; // Ajusta la ruta según tu proyecto

@Entity({ name: 'smartwatch_link' })
export class SmartwatchLinkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEntity, user => user.smartwatchLinks, { onDelete: 'CASCADE' })
  user: ClientEntity;

  @Column({ type: 'varchar', length: 64, unique: true })
  code: string;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
