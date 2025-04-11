import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id_log: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  usuario: string;

  @Column({
    type: 'enum',
    enum: ['INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ERROR', 'OTRO'],
    nullable: false,
  })
  accion: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ERROR' | 'OTRO';

  @Column({ type: 'varchar', length: 100, nullable: false })
  tabla_afectada: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_usuario: string;
}
