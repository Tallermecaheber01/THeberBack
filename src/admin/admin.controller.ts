import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe, Query  } from '@nestjs/common';

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
import { Repository } from 'typeorm';
import { DemarcationService } from './demarcation/demarcation.service';
import { UpdateDemarcationDto } from './demarcation/dto/update-demarcation.dto';
import { DemarcationEntity } from './demarcation/entities/demarcation.entity';
import {SecurityPolicyService} from './security_policy/securityPolicy.service'
import { UpdateSecurityPolicyDto } from './security_policy/dto/update-securitypolicy.dto';
import { SecurityPolicyEntity } from './security_policy/entities/securityPolicy.entity';
import { TermsService } from './terms/terms.service';
import { UpdateTermsDto } from './terms/dto/update-terms.dto';
import { TermsEntity } from './terms/entities/terms.entity';
//FAQ
import { CreateFaqDto } from './FAQ/dto/create_FAQ.dto';
import { UpdateFaqDto } from './FAQ/dto/update_FAQ.dto';
import { DeleteFaqDto } from './FAQ/dto/delete_FAQ.dto';
import { Faq } from './FAQ/entities/FAQ.entity';
import { FaqService } from './FAQ/faq.service';
//quiz
import { CreateQuizQuestionDto } from './quizQuestion/dto/create_quizQuestion.dto';
import { UpdateQuizQuestionDto } from './quizQuestion/dto/update_quizQuestion.dto';
import { DeleteQuizQuestionDto } from './quizQuestion/dto/delete_quizQuestion.dto';
import { QuizQuestionService } from './quizQuestion/quizQuestion.service';
import { QuizContactService } from './quizContact/quizContact.service';
import { UpdateQuizContactDto } from './quizContact/dto/update_quizContac.dto';
import { QuizContact } from './quizContact/entities/quizContact.entity';


@Controller('admin')
export class AdminController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly corporateimageService: CorporateimageService,
    private readonly contactService: ContactService,
    private readonly policeService: PoliceService,
    private logger: LoggerService,
    private readonly demarcationService: DemarcationService,
    private readonly securityPolicyService: SecurityPolicyService,
    private readonly termsService: TermsService,
    private readonly faqService: FaqService,
    private readonly quizQuestionService: QuizQuestionService,  
    private readonly quizContactService: QuizContactService,

  ) { }


  @Post('new-service')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createService(
    @Body(new ValidationPipe()) serviceData: CreateServiceDto,
    @Request() req: any
  ): Promise<ServiceEntity> {

    return this.serviceService.createService(serviceData);
  }


  @Post('new-brand')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createBrand(
    @Body(new ValidationPipe) brandData: CreateBrandDto,
    @Request() req: any
  ): Promise<BrandEntity> {

    return this.serviceService.createBrand(brandData);
  }

  @Post('new-vehicletype')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createVehicleType(
    @Body(new ValidationPipe) vehicleData: CreateVehicleDto,
    @Request() req: any
  ): Promise<VehicleTypeEntity> {

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

    await this.serviceService.deleteService(id);
  }

  @Delete('delete-brand/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteBrand(
    @Param('id') id: number,
    @Request() req: any
  ): Promise<void> {
    await this.serviceService.deleteBrand(id);
  }

  @Delete('delete-vehicletype/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteVehicleType(
    @Param('id') id: number,
    @Request() req: any
  ): Promise<void> {
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

    await this.contactService.remove(id);
  }


  @Post('new-police')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createPolice(
    @Body(new ValidationPipe()) createPoliceDto: CreatePoliceDto,
    @Request() req: any
  ): Promise<Police> {
    
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

  //demarcation
    @Get('demarcations')
  async getAllDemarcations(): Promise<DemarcationEntity[]> {
    return this.demarcationService.findAll();
  }

  //actualiza 
  @Patch('demarcations/:id')
    @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateDemarcation(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateDemarcationDto
  ): Promise<DemarcationEntity> {
    return this.demarcationService.update(id, dto);
  }

  //Políticas de seguridad
    @Get('security-policies')
  async getAllSecurityPolicies(): Promise<SecurityPolicyEntity[]> {
    return this.securityPolicyService.findAll();
  }

  @Patch('security-policies/:id')
    @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateSecurityPolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateSecurityPolicyDto
  ): Promise<SecurityPolicyEntity> {
    return this.securityPolicyService.update(id, dto);
  }


    //para traer todos los terminos
  @Get('terms')
  async getAllTerms(): Promise<TermsEntity[]> {
    return this.termsService.findAll();
  }

  //actualiza
  @Patch('terms/:id')
    @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateTerms(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateTermsDto
  ): Promise<TermsEntity> {
    return this.termsService.update(id, dto);
  }

  //faq
  @Post('new-faq')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createFaq(
    @Body(new ValidationPipe()) createFaqDto: CreateFaqDto,
    @Request() req: any
  ): Promise<Faq> {
    return this.faqService.create(createFaqDto);
  }

  @Get('all-faqs')
  async getAllFaqs(): Promise<Faq[]> {
    return this.faqService.findAll();
  }

    @Get('faq/search')
  async searchFaqs(@Query('q') query: string): Promise<Faq[]> {
    return this.faqService.searchPartial(query);
  }

  @Get('faq/exact')
  async findFaqByPregunta(
    @Query('pregunta') pregunta: string
  ): Promise<Faq | null> {
    return this.faqService.findByPregunta(pregunta);
  }


  @Get('faq/:id')
  async getFaqById(
    @Param('id', ParseIntPipe) id_faq: number
  ): Promise<Faq> {
    return this.faqService.findOneById(id_faq);
  }

  @Patch('update-faq')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateFaq(
    @Body(new ValidationPipe({ whitelist: true })) updateFaqDto: UpdateFaqDto,
    @Request() req: any
  ): Promise<Faq> {
    return this.faqService.update(updateFaqDto);
  }

  @Delete('delete-faq/:id')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteFaq(
    @Param('id', ParseIntPipe) id_faq: number,
    @Request() req: any
  ): Promise<void> {
    await this.faqService.remove({ id_faq });
  }

  //quizQuestion
  @Post('quiz/new-question')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async createQuizQuestion(
    @Body(new ValidationPipe()) createDto: CreateQuizQuestionDto,
    @Request() req: any
  ) {
    return this.quizQuestionService.create(createDto);
  }

  @Get('quiz/questions')
  async getAllQuizQuestions() {
    return this.quizQuestionService.findAll();
  }

  @Get('quiz/question/:id')
  async getQuizQuestionById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.quizQuestionService.findOne(id);
  }

  @Patch('quiz/update-question')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateQuizQuestion(
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateQuizQuestionDto,
    @Request() req: any
  ) {
    return this.quizQuestionService.update(updateDto);
  }

  @Delete('quiz/delete-question')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteQuizQuestion(
    @Body(new ValidationPipe()) deleteDto: DeleteQuizQuestionDto,
    @Request() req: any
  ) {
    await this.quizQuestionService.remove(deleteDto);
  }

  // quizContact
  @Patch('quiz/contact')
  @Roles('administrador')
  @UseGuards(AuthGuard, RoleGuard)
  async updateQuizContact(
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateQuizContactDto,
    @Request() req: any
  ): Promise<QuizContact> {
    return this.quizContactService.update(updateDto);
  }

  @Get('quiz/contacts')
  async getQuizContact(): Promise<QuizContact> {
    return this.quizContactService.findOne();
  }
}
