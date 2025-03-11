import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VehicleEntity } from 'src/client/vehicles/entities/vehicle.entity';

@Entity('users')  // Esto indica que esta entidad corresponde a la tabla 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;  // El campo 'id' es autoincrementable y clave primaria

  @Column({ type: 'varchar', length: 100 })
  nombre: string;  // Campo para 'nombre'

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

  @Column({ type: 'boolean', default: false })
  estadoBloqueo: boolean;  // Estado del bloqueo, si está bloqueado o no

  @Column({ type: 'int', default: 0 })
  intentosFallidos: number;  // Número de intentos fallidos

  @Column({ type: 'timestamp', nullable: true })
  fechaDesbloqueo: Date | null;  // Fecha de desbloqueo, si está bloqueado

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.idPropietario)
  vehiculos: VehicleEntity[];
}
