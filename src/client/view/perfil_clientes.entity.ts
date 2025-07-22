import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';

@Entity('perfil_clientes')
export class PerfilClientesEntity {
  @PrimaryColumn({ name: 'idCliente', type: 'int' })
  idCliente: number;

  @Column({ name: 'nombre', type: 'varchar' })
  nombre: string;

  @Column({ name: 'apellido_paterno', type: 'varchar' })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno', type: 'varchar' })
  apellidoMaterno: string;

  @Column({ name: 'total_citas', type: 'int' })
  totalCitas: number;

  @Column({ name: 'total_servicios', type: 'int' })
  totalServicios: number;

  @Column({ name: 'gasto_total', type: 'decimal', precision: 10, scale: 2 })
  gastoTotal: number;

  @Column({ name: 'gasto_promedio', type: 'decimal', precision: 10, scale: 2 })
  gastoPromedio: number;

  @ManyToOne(() => ClientEntity, client => client.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCliente' })
  cliente: ClientEntity;
}