import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact_info')
export class QuizContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 255 })
  sitio_web: string;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Column({ type: 'text', nullable: true })
  promocion: string;
}
