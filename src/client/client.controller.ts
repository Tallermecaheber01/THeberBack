import { Controller, Delete, Get, Param } from '@nestjs/common';
import { InformationService } from './information/information.service';
import { User } from 'src/users/entity/user.entity';
//import { VehiclesService } from './vehicles/vehicles.service';

@Controller('client')
export class ClientController {
  constructor(
    private readonly informationService: InformationService,
   // private readonly vehicleService: VehiclesService
  ) { }

  // Ruta para obtener el usuario por ID
  /*@Get(':id')
  async getClientById(@Param('id') id: number): Promise<User> {
    return this.informationService.getUserById(id);
  }

  // Ruta para obtener solo el rol del usuario por ID
  @Get(':id/role')
  async getClientRoleById(@Param('id') id: number): Promise<string> {
    return this.informationService.getUserRoleById(id);
  }*/
  /*@Delete('delete-service/:id')
  async deleteService(@Param('id') id: number): Promise<void> {
    await this.vehicleService.deleteService(id);
  }*/


}
