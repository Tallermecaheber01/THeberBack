import { Entity, ViewEntity, PrimaryColumn, Column } from 'typeorm';

// Usamos ViewEntity para representar una vista en lugar de @Entity
@ViewEntity('user_vehicle_view')
export class UserVehicleViewEntity {
  @PrimaryColumn()
  user_id: number;

  @Column()
  user_nombre: string;

  @PrimaryColumn()
  vehicle_id: number;

  @Column()
  vehicle_numeroSerie: string;

  @Column()
  vehicle_marca: string;

  @Column()
  vehicle_modelo: string;

  @Column()
  vehicle_año: number;

  @Column()
  vehicle_placa: string;
}
