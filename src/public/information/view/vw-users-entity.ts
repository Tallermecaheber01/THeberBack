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
    contrasena: string;  // 🔐 Nueva columna agregada

    @Column({ type: "varchar", length: 20 })
    rol: string;
}