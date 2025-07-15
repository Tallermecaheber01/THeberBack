// src/pago/dto/create-pago.dto.ts
export class CreatePagoDto {
  servicio: string;
  total: number;
  idCliente: number;
  fecha: string;
  hora: string;
  formaPago: 'Mercado Pago' | 'Efectivo';
}
