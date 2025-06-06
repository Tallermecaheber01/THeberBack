

import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { VehiclesService } from './vehicles/vehicles.service';

import { CreateVehicleDto } from './vehicles/dto/create-vehicle.dto';
import { VehicleEntity } from './vehicles/entities/vehicle.entity';
import { BrandEntity } from 'src/admin/service/entities/brand.entity';

import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/guards/role/role.guard';
import { AuthGuard } from 'src/role/guards/authguard/authguard.guard';
import { AppointmentClientService } from './appointment-client/appointment-client.service';
import { VwAppointmentDetails } from './appointment-client/view/vw-appointment-details.entity';


@Controller('client')
export class ClientController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly appointmentClientService: AppointmentClientService,

  ) { }

  @Post('new-vehicle')
  async createVehicle(
    @Body() vehicleData: CreateVehicleDto,
  ): Promise<VehicleEntity> {
    return this.vehiclesService.createVehicle(vehicleData);
  }

  @Get('brands')
  async getAllBrand(): Promise<BrandEntity[]> {
    return this.vehiclesService.getAllBrand();
  }

  @Get('vehicles')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllVehicles(@Req() req: any): Promise<VehicleEntity[]> {
    const userId = req.user['userId']; // Assuming the user ID is stored in the request object
    return this.vehiclesService.getVehiclesByOwner(userId);
  }

  @Put('update-vehicle/:id')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async updateVehicle(
    @Param('id') id: number,
    @Body() vehicleData: CreateVehicleDto,
  ): Promise<VehicleEntity> {
    return this.vehiclesService.updateVehicle(id, vehicleData);
  }

  @Delete('delete-vehicle/:id')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteVehicle(@Param('id') id: number): Promise<void> {
    return this.vehiclesService.deleteVehicle(id);
  }

  @Get('appointments')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async getAppointments(@Req() req: any): Promise<any> {
    const idCliente = req.user?.userId; // Usa la clave correcta del token JWT
    if (!idCliente) {
      throw new Error('ID del cliente no disponible en el token.');
    }

    return this.appointmentClientService.getAppointmentsByClientId(idCliente);
  }


}
