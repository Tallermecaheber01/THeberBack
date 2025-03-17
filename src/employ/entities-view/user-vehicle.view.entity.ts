import { Entity, ViewEntity, PrimaryColumn, Column } from 'typeorm';

// Usamos ViewEntity para representar una vista en lugar de @Entity
@ViewEntity('vw_client_vehicles')
export class UserVehicleViewEntity {
  @Column()
    idCliente: number;

    @Column()
    nombreCompletoCliente: string;

    @Column()
    correoCliente: string;

    @Column()
    telefonoCliente: string;

    @Column()
    rolCliente: string;

    @Column()
    idVehiculo: number;

    @Column()
    numeroSerie: string;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column()
    año: number;

    @Column()
    placa: string;
}
