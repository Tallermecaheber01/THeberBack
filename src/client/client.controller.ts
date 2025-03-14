import { Controller, Get, Param } from '@nestjs/common';
import { InformationService } from './information/information.service';
import { User } from 'src/users/entity/user.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly informationService: InformationService) {}

  // Ruta para obtener el usuario por ID
  @Get(':id')
  async getClientById(@Param('id') id: number): Promise<User> {
    return this.informationService.getUserById(id);
  }

  // Ruta para obtener solo el rol del usuario por ID
  @Get(':id/role')
  async getClientRoleById(@Param('id') id: number): Promise<string> {
    return this.informationService.getUserRoleById(id);
  }
}
