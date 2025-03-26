import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('logs')  // Nombre de la tabla en la base de datos
export class LogEntity {
    @PrimaryGeneratedColumn()  // Esto generará automáticamente un campo 'id' como clave primaria
    id: number;

    @Column({ type: 'timestamp' })
    timestamp: Date;  // Fecha y hora del evento

    @Column({ type: 'varchar', length: 10 })
    level: string;  // Nivel del log (INFO, WARNING, ERROR,)etcétera

    @Column('text')
    message: string;  // Mensaje del evento

    @Column({ type: 'varchar', length: 100, nullable: true })
    user: string | null;  // Usuario asociado (si aplica)

    @Column('text', { nullable: true })
    extraInfo: string;  // Asegúrate de que esta columna esté definida correctament
}
