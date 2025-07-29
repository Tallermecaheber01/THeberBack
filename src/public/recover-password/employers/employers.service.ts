import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizedPersonnelEntity } from '../entity/authorized-personnel-entity';
import { CreateEmployersDto } from './dto/create-employers.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployersService {
  constructor(
    @InjectRepository(AuthorizedPersonnelEntity)
    private readonly personnelRepo: Repository<AuthorizedPersonnelEntity>,
  ) {}

  async findAll(): Promise<AuthorizedPersonnelEntity[]> {
    // Opcional: incluir la relación de pregunta
    return this.personnelRepo.find({ relations: ['preguntaSecreta'] });
  }

  async create(dto: CreateEmployersDto): Promise<AuthorizedPersonnelEntity> {
    // 1) Validar que ambas contraseñas coincidan
    if (dto.contrasena !== dto.confirmarContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // 2) Verificar correo único
    const correoExiste = await this.personnelRepo.findOne({ where: { correo: dto.correo } });
    if (correoExiste) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // 3) Generar salt y hashear contraseña + respuesta secreta
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.contrasena, salt);
    const hashedAnswer   = await bcrypt.hash(dto.respuestaSecreta, salt);

    // 4) Crear la entidad con todas las propiedades
    const nuevoEmpleado = this.personnelRepo.create({
      nombre: dto.nombre,
      apellido_paterno: dto.apellido_paterno,
      apellido_materno: dto.apellido_materno,
      correo: dto.correo,
      telefono: dto.telefono,
      contrasena: hashedPassword,    // contraseña hasheada
      respuestaSecreta: hashedAnswer,// respuesta secreta hasheada
      preguntaSecreta: { id: dto.preguntaSecretaId } as any,
      rol: 'empleado',
      estado: 'activo',
      intentosFallidos: 0,
      fechaDesbloqueo: null,         // si tu entidad lo define
    });

    // 5) Guardar en base de datos
    return this.personnelRepo.save(nuevoEmpleado);
  }

  async delete(id: number): Promise<void> {
    await this.personnelRepo.delete(id);
  }
}

