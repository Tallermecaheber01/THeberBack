import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('feedback') // Define el nombre de la tabla en la base de datos
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number; // Identificador único autoincremental

  @Column({ type: 'varchar', length: 100 })
  nombre: string; // Nombre del usuario que deja el feedback

  @Column({ type: 'varchar', length: 100 })
  servicio: string; // Servicio sobre el que se deja el comentario

  @Column({ type: 'text' })
  comentario: string; // Comentario del usuario
}
