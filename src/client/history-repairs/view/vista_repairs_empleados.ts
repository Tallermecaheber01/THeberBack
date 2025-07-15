import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({ name: 'vista_repairs_empleados' })
export class VistaRepairsEmpleados {
  @ViewColumn()
  id: number;

  @ViewColumn()
  idEmpleado: number;

  @ViewColumn()
  nombre_completo_empleado: string;

  @ViewColumn()
  idCliente: number;

  @ViewColumn()
  idCita: number;

  @ViewColumn()
  fechaHoraAtencion: Date;

  @ViewColumn()
  servicio: string;

  @ViewColumn()
  fechaCita: Date;

  @ViewColumn()
  horaCita: string;

  @ViewColumn()
  costoInicial: number;

  @ViewColumn()
  comentario: string;

  @ViewColumn()
  extra: string;

  @ViewColumn()
  totalFinal: number;

  @ViewColumn()
  estado: string;

  // Solo estos campos porque son los que tienes en la vista
  @ViewColumn()
  marca: string;

  @ViewColumn()
  modelo: string;
}
