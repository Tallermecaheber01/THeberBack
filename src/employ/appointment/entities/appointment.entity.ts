import { IsDate, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment')
export class AppointmentEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    @IsString()
    nombreCliente: string;
  
    @Column({ type: 'varchar', length: 255 })
    @IsString()
    nombreEmpleado: string;
  
    @Column({ type: 'date' })
    @IsDate()
    fecha: string;
  
    @Column({ type: 'time' })
    @IsString()  // Puede ser un string, ya que la hora se guarda como texto
    hora: string;
  
    @Column({ type: 'varchar', length: 255 })
    @IsString()
    nombreServicio: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive()  // Validación para que el costo sea positivo
    costoServicio: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @IsOptional()  // Opcional
    @IsNumber()
    costoExtra: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive()  // Validación para que el total sea positivo
    total: number;
}