
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe, Logger, ParseIntPipe } from '@nestjs/common';

import { VehiclesService } from './vehicles/vehicles.service';

import { CreateVehicleDto } from './vehicles/dto/create-vehicle.dto';
import { VehicleEntity } from './vehicles/entities/vehicle.entity';
import { BrandEntity } from 'src/admin/service/entities/brand.entity';

import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/guards/role/role.guard';
import { AuthGuard } from 'src/role/guards/authguard/authguard.guard';
import { AppointmentClientService } from './appointment-client/appointment-client.service';
import { VwAppointmentDetails } from './appointment-client/view/vw-appointment-details.entity';
import { RepairPaymentService } from './repair-payment/repair-payment.service';
import { HistoryRepairsService } from './history-repairs/history-repairs.service';
import { VistaRepairsEmpleados } from './history-repairs/view/vista_repairs_empleados';
import { RepairPaymentEntity } from './repair-payment/entity/repair.entity';
import { CreateAppointmentDto } from './appointment-client/dto/create-appointment-client.dto';
import { UpdateAppointmentDto } from './appointment-client/dto/update-appointment-client.dto';
import { CreateCancellationDto } from './appointment-client/dto/create-cancellation.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { NotificationService } from './smartwatch/notification.service';
import { LinkSmartwatchDto } from './smartwatch/comparate_token_smartwatch.dto';
import { UnlinkSmartwatchDto } from './smartwatch/unlink-smartwatch.dto';
import { FeedbackService } from './feedback/feedback.service';
import { CreateFeedbackDto } from './feedback/dto/create-feedback.dto';
import { FeedbackEntity } from './feedback/entities/feedback.entity';
import { VwPerfilClienteService } from './view/perfil_cliente.service';
import { PerfilClientesEntity } from './view/perfil_clientes.entity';

@Controller('client')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly appointmentClientService: AppointmentClientService,
    private readonly repairService: RepairPaymentService,
    private readonly historyRepairsService: HistoryRepairsService,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    private readonly notificationService: NotificationService,
    private readonly feedbackService: FeedbackService,
    private readonly vwPerfilClienteService: VwPerfilClienteService,

    @InjectRepository(PerfilClientesEntity)
    private readonly perfilRepo: Repository<PerfilClientesEntity>,
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


  //Apartado para pagos de reparaciones
  @Get('payment')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllRepairsPay(@Req() req: any): Promise<RepairPaymentEntity[]> {
    const idCliente = req.user?.userId; // Usa la clave correcta del token JWT
    if (!idCliente) {
      throw new Error('ID del cliente no disponible en el token.');
    }
    return this.repairService.getRepairsPayment(idCliente);
  }

  @Put('repair/:id/set-in-process')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async setRepairInProcess(
    @Param('id') idReparacion: number,
    @Req() req: any,
  ): Promise<RepairPaymentEntity> {
    const idCliente = req.user?.userId;
    if (!idCliente) {
      throw new BadRequestException('ID del cliente no disponible en el token.');
    }

    try {
      const repairActualizada = await this.repairService.markRepairAsInProcess(idReparacion, idCliente);
      return repairActualizada;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('repair-history')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async getRepairHistory(@Req() req: any): Promise<VistaRepairsEmpleados[]> {
    const idCliente = req.user?.userId;

    if (!idCliente) {
      throw new BadRequestException('ID del cliente no disponible en el token.');
    }

    return this.historyRepairsService.obtenerPorCliente(idCliente);
  }

  @Post('appointments')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async createAppointment(@Req() req: any, @Body() body: CreateAppointmentDto) {
    const idCliente = req.user?.userId;

    if (!idCliente) {
      throw new BadRequestException('ID del cliente no disponible en el token.');
    }

    return await this.appointmentClientService.createAppointment(body, idCliente);
  }

  @Get('appointments/:id')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async getAppointmentById(@Param('id') id: string) {
    const cita = await this.appointmentClientService.getAppointmentById(+id);
    if (!cita) {
      throw new NotFoundException('Cita no encontrada');
    }
    return cita;
  }

  @Patch('appointments/:id/fecha')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async updateAppointmentFechaHora(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentDto,
  ) {
    return await this.appointmentClientService.updateAppointmentDateTime(+id, body);
  }

  @Post('appointments/:id/cancel')
  @Roles('cliente')
  @UseGuards(AuthGuard, RoleGuard)
  async cancelAppointment(
    @Param('id') id: string,
    @Body() cancellationDto: CreateCancellationDto,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const idCliente = req.user?.userId;
    if (!idCliente) {
      throw new BadRequestException('ID del cliente no disponible en el token.');
    }

    const cita = await this.appointmentClientService.getAppointmentById(+id);
    if (!cita) {
      throw new NotFoundException('Cita no encontrada');
    }
    if (cita.idCliente !== idCliente) {
      throw new BadRequestException('No puedes cancelar una cita que no es tuya');
    }

    return this.appointmentClientService.cancelAppointment(+id, cancellationDto);
  }

  @Post(':id/generar-codigo-smartwatch')
  async generarCodigoSmartwatch(@Param('id') id: number): Promise<{ code: string }> {
    const user = await this.clientRepository.findOne({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');

    const code = await this.notificationService.generarCodigoSmartwatch(user);
    return { code };
  }
  @Post('vinculacion')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async linkSmartwatch(@Body() dto: LinkSmartwatchDto): Promise<{ message: string }> {
    this.logger.log(`Petición de vinculación recibida con código: ${dto.code}`);
    await this.notificationService.linkSmartwatch(dto.code, dto.fcmToken);
    return { message: 'Vinculación exitosa' };
  }

  @Post('desvincular_smartwatch')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async unlinkSmartwatch(
    @Body() dto: UnlinkSmartwatchDto
  ): Promise<{ message: string }> {
    this.logger.log(`Petición desvincular recibida, token: ${dto.fcmToken}`);
    await this.notificationService.unlinkSmartwatchByToken(dto.fcmToken);
    return { message: 'Desvinculación exitosa' };
  }

  @Post(':id/feedback')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateFeedbackDto
  ): Promise<FeedbackEntity> {
    return await this.feedbackService.create(dto);
  }

  // Obtiene todos los feedbacks

  @Get('feedback')
  async getAllFeedback(): Promise<FeedbackEntity[]> {
    return await this.feedbackService.findAll();
  }

  //Obtiene un feedback por ID

  @Get('feedback/:feedbackId')
  async getFeedbackById(
    @Param('feedbackId', ParseIntPipe) feedbackId: number
  ): Promise<FeedbackEntity> {
    return await this.feedbackService.findOneById(feedbackId);
  }

  // Elimina un feedback por ID

  @Delete('feedback/:feedbackId')
  async deleteFeedback(
    @Param('feedbackId', ParseIntPipe) feedbackId: number
  ): Promise<{ message: string }> {
    await this.feedbackService.remove(feedbackId);
    return { message: 'Feedback eliminado exitosamente' };
  }

  @Get('debug-perfil')
  async debugPerfil(): Promise<PerfilClientesEntity[]> {
    return await this.perfilRepo.find();
  }

  @Get('debug-perfil/:id')
  async debugPerfilById(@Param('id') id: number): Promise<PerfilClientesEntity | null> {
    return await this.perfilRepo.findOne({ where: { idCliente: id } });
  }

}

