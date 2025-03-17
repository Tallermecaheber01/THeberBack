import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('authorizedpersonnel')
export class AuthorizedPersonnelEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    apellido_paterno: string;  // Campo para 'apellido_paterno'

    @Column({ type: 'varchar', length: 100 })
    apellido_materno: string;  // Campo para 'apellido_materno'

    @Column({ type: 'varchar', length: 100, unique: true })
    correo: string;  // Campo para 'correo', debe ser único

    @Column({ type: 'varchar', length: 20 })
    telefono: string;  // Campo para 'telefono'

    @Column({ type: 'varchar', length: 255 })
    contrasena: string;  // Campo para 'contraseña'

    @Column({ type: 'varchar', length: 20, default: 'client' })
    rol: string;

    @Column({ nullable: true })
    codigo_verificacion: string;
}