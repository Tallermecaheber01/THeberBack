import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'faq' })
export class Faq {
  @PrimaryGeneratedColumn({ name: 'id_faq' })
  id_faq: number;

  @Column('text', { name: 'pregunta' })
  pregunta: string;

  @Column('text', { name: 'respuesta' })
  respuesta: string;
}
