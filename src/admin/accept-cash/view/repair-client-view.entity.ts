import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_reparaciones_con_clientes' })
export class RepairClientViewEntity {
  @ViewColumn()
  idReparacion: number;

  @ViewColumn()
  idEmpleado: number;

  @ViewColumn()
  idCliente: number;

  @ViewColumn()
  idCita: number;

  @ViewColumn()
  fechaHoraAtencion: Date;

  @ViewColumn()
  servicio: string[]; // Si lo guardas como JSON o array en la BD

  @ViewColumn()
  fechaCita: string;

  @ViewColumn()
  horaCita: string;

  @ViewColumn()
  costoInicial: string;

  @ViewColumn()
  comentario: string;

  @ViewColumn()
  extra: string;

  @ViewColumn()
  totalFinal: string;

  @ViewColumn()
  estado: string;

  @ViewColumn()
  nombreCompletoCliente: string;
}
