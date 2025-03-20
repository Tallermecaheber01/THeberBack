import { Column, ViewEntity } from "typeorm";

@ViewEntity('vw_users')
export class UserViewEntity {
    @Column()
    id: number; // No es PrimaryGeneratedColumn porque es una vista

    @Column({ type: "varchar", length: 50 })
    nombre: string;

    @Column({ type: "varchar", length: 50 })
    apellido_paterno: string;

    @Column({ type: "varchar", length: 50 })
    apellido_materno: string;

    @Column({ type: "varchar", length: 100 })
    correo: string;

    @Column({ type: "varchar", length: 20 })
    telefono: string;

    @Column({ type: "varchar", length: 255 })
    contrasena: string;

    @Column({ type: "varchar", length: 20 })
    rol: string;

    @Column({ type: 'enum', enum: ['activo', 'bloqueado'] })
    estado: 'activo' | 'bloqueado';  // Nueva columna para el estado

    @Column({ type: 'datetime', nullable: true })
    fechaDesbloqueo: Date | null; // Nueva columna para la fecha de desbloqueo

    @Column({ type: "int" })  // 🛠️ Nueva columna para la ID de la pregunta secreta
    idPreguntaSecreta: number;

    @Column({ type: "varchar", length: 255 })
    respuestaSecreta: string;

    @Column({ type: "int", default: 0 })  // 🚀 Nueva columna para intentos fallidos
    intentosFallidos: number;
}
