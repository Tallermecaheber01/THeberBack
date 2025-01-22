import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidoPaterno: string;

  @Column()
  apellidoMaterno: string;

  @Column()
  correo: string;

  @Column()
  telefono: string;

  @Column()
  usuario: string;

  @Column()
  contrasena: string;

  @Column({ default: 'client' })
  rol: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
