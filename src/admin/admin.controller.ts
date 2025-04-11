import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';

import { ServiceService } from './service/service.service';

import { CreateServiceDto } from './service/dto/create-service.dto';
import { CreateBrandDto } from './service/dto/create-brand.dto';
import { CreateVehicleDto } from './service/dto/create-vechicle.dto';
import { CreateContactDto } from './contact/dto/create-contacts.dto';


import { UpdateServiceDto } from './service/dto/update-service.dto';
import { UpdateBrandDto } from './service/dto/update-brand.dto';
import { UpdateVehicleDto } from './service/dto/update-vehicle.dto';
import { UpdateCorporateImageDto } from './corporateimage/dto/update-corporateimage.dto';
import { UpdateContactDto } from './contact/dto/update-contacts.dto';
import { CreatePoliceDto } from './policies/dto/create-policies.dto';
import { UpdatePoliceDto } from './policies/dto/update-policies.dto';



import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleTypeEntity } from './service/entities/vehicle.entity';
import { CorporateImage } from './corporateimage/entities/corporateimage.entity';
import { Contact } from './contact/entities/contacts.entity';
import { Police } from './policies/entities/policies.entity';

import { CorporateimageService } from './corporateimage/corporateimage.service';
import { ContactService } from './contact/contact.service';
import { PoliceService } from './policies/policies.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/role/guards/authguard/authguard.guard';
import { RoleGuard } from 'src/role/guards/role/role.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from 'src/log/entity/log.entity';
import { Repository } from 'typeorm';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly corporateimageService: CorporateimageService,
    private readonly contactService: ContactService,
    private readonly policeService: PoliceService,
    private logger: LoggerService,

    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,

  ) { }


  @Post('new-service')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createService(
    @Body(new ValidationPipe()) serviceData: CreateServiceDto,
    @Request() req: any
  ): Promise<ServiceEntity> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'INSERT',  // Acción que describe la creación
      tabla_afectada: 'services',
      descripcion: 'Creacion de un nuevo servicio',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);  // Guardar log en la base de datos
    return this.serviceService.createService(serviceData);
  }


  @Post('new-brand')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createBrand(
    @Body(new ValidationPipe) brandData: CreateBrandDto,
    @Request() req: any
  ): Promise<BrandEntity> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'INSERT',  // Acción que describe la creación
      tabla_afectada: 'brands',
      descripcion: 'Creación de una nueva marca',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);  // Guardar log en la base de datos
    return this.serviceService.createBrand(brandData);
  }

  @Post('new-vehicletype')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createVehicleType(
    @Body(new ValidationPipe) vehicleData: CreateVehicleDto,
    @Request() req: any
  ): Promise<VehicleTypeEntity> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'INSERT',  // Acción que describe la creación
      tabla_afectada: 'vehicleTypes',
      descripcion: 'Creación de un nuevo tipo de vehiculo',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);  // Guardar log en la base de datos
    return this.serviceService.createVehicleType(vehicleData);
  }

  @Patch('update-service/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: UpdateServiceDto,
    @Request() req: any
  ): Promise<ServiceEntity> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'UPDATE',  // Acción que describe la creación
      tabla_afectada: 'services',
      descripcion: 'Modificacion de un servicio',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    return this.serviceService.updateService(id, updateData);
  }

  @Patch('update-brand/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: UpdateBrandDto,
    @Request() req: any
  ): Promise<BrandEntity> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'UPDATE',  // Acción que describe la creación
      tabla_afectada: 'brands',
      descripcion: 'Modificacion de una marca',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);

    return this.serviceService.updateBrand(id, updateData);
  }

  @Patch('update-vehicletype/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateVehicleType(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: UpdateVehicleDto,
    @Request() req: any
  ): Promise<VehicleTypeEntity> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'UPDATE',  // Acción que describe la creación
      tabla_afectada: 'vehicleType',
      descripcion: 'Modificacion de un tipo de vehiculo',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);

    return this.serviceService.updateVehicleType(id, updateData);
  }

  @Get('all-services')
  async getAllServices(): Promise<ServiceEntity[]> {
    return this.serviceService.getAllservices();
  }

  @Get('service/:id')
  async getServiceById(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity[]> {
    return this.serviceService.getServiceById(id);
  }

  @Get('all-brands')
  async getAllBrands(): Promise<BrandEntity[]> {
    return this.serviceService.getAllBrands();
  }

  @Get('all-vehicletypes')
  async getAllVehicleTypes(): Promise<VehicleTypeEntity[]> {
    return this.serviceService.getAllVehicleTypes();
  }

  @Delete('delete-service/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteService(
    @Param('id') id: number,
    @Request() req: any
  ): Promise<void> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'DELETE',  // Acción que describe la creación
      tabla_afectada: 'service',
      descripcion: 'Eliminacion de un servicio',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);

    await this.serviceService.deleteService(id);
  }

  @Delete('delete-brand/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteBrand(
    @Param('id') id: number,
    @Request() req: any
  ): Promise<void> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'DELETE',  // Acción que describe la creación
      tabla_afectada: 'brands',
      descripcion: 'Eliminacion de una marca',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    await this.serviceService.deleteBrand(id);
  }

  @Delete('delete-vehicletype/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteVehicleType(
    @Param('id') id: number,
    @Request() req: any
  ): Promise<void> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'DELETE',  // Acción que describe la creación
      tabla_afectada: 'vehicleType',
      descripcion: 'Eliminacion de un tipo de vehiculo',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    await this.serviceService.deleteVehicleType(id);
  }

  //mision, vision
  @Patch('updatecorporateimage/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateCorporateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: UpdateCorporateImageDto,
    @Request() req: any
  ): Promise<CorporateImage> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'UPDATE',  // Acción que describe la creación
      tabla_afectada: 'mision, vision',
      descripcion: 'Modificacion de la mision, vision de la empresa',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    return this.corporateimageService.update(id, updateData);
  }

  @Get('allcorporateimages')
  async getAllCorporateImages(): Promise<CorporateImage[]> {
    return this.corporateimageService.findAll();
  }

  @Get('corporateimage/:id')
  async getCorporateImageById(@Param('id', ParseIntPipe) id: number): Promise<CorporateImage> {
    return this.corporateimageService.findOneById(id);
  }

  @Post('newcontact')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createContact(
    @Body(new ValidationPipe()) createContactDto: CreateContactDto,
    @Request() req: any
  ): Promise<Contact> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'INSERT',  // Acción que describe la creación
      tabla_afectada: 'contact',
      descripcion: 'Creando un nuevo dato de contacto de la empresa',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    return this.contactService.create(createContactDto);
  }

  @Patch('updatecontact/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateContact(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateContactDto: UpdateContactDto,
    @Request() req: any
  ): Promise<Contact> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'UPDATE',  // Acción que describe la creación
      tabla_afectada: 'contact',
      descripcion: 'Modificando un dato de contacto de la empresa',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    return this.contactService.update(id, updateContactDto);
  }

  @Get('all-contacts')
  async getAllContacts(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Get('contact/:id')
  async getContactById(@Param('id', ParseIntPipe) id: number): Promise<Contact> {
    return this.contactService.findOneById(id);
  }

  @Delete('deletecontact/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteContact(
    @Param('id') id: number,
    @Request() req: any
  ): Promise<void> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'DELETE',  // Acción que describe la creación
      tabla_afectada: 'contact',
      descripcion: 'Eliminacion de un dato de contacto de la empresa',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    await this.contactService.remove(id);
  }


  @Post('new-police')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createPolice(
    @Body(new ValidationPipe()) createPoliceDto: CreatePoliceDto,
    @Request() req: any
  ): Promise<Police> {
    const userEmail = req.user.email;
    const userIp = req.ip;

    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'INSERT',  // Acción que describe la creación
      tabla_afectada: 'police',
      descripcion: 'Creacion de nuevas politicas de la empresa',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    return this.policeService.create(createPoliceDto);
  }

  @Patch('update-police/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updatePolice(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatePoliceDto: UpdatePoliceDto,
    @Request() req: any
  ): Promise<Police> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    
    const log = this.logRepository.create({
      usuario: userEmail,
      accion: 'UPDATE',  // Acción que describe la creación
      tabla_afectada: 'police',
      descripcion: 'Modificacion de las politicas de la empresa',
      ip_usuario: userIp,
    });

    await this.logRepository.save(log);
    return this.policeService.update(id, updatePoliceDto);
  }

  @Get('all-polices')
  async getAllPolices(): Promise<Police[]> {
    return this.policeService.findAll();
  }

  @Get('police/:id')
  async getPoliceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Police> {
    return this.policeService.findOneById(id);
  }

  @Delete('delete-police/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deletePolice(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<void> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    this.logger.logDbAction(
      'DELETE',
      'police',
      'Eliminacion de piliticas de la empresa',
      userEmail,
      userIp
    )
    await this.policeService.remove(id);
  }

  @Patch('update-status/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<Police> {
    const userEmail = req.user.email;
    const userIp = req.ip;
    this.logger.logDbAction(
      'UPDATE',
      'police',
      'Cambio de estatus en una politica de la empresa',
      userEmail,
      userIp
    )

    return this.policeService.actualizarEstado(id);
  }


}
