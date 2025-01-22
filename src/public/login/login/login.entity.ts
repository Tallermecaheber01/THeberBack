import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Aquí especificas el nombre de la tabla
export class usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario: string;

  @Column()
  contrasena: string;

  @Column({ default: 'client' })
  rol: string;

}
