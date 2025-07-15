import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';

//Services
import { ServiceService } from './service/service.service';
import { ContactService } from './contact/contact.service';
import { CorporateimageService } from './corporateimage/corporateimage.service';
import { AppointmentService } from 'src/employ/appointment/appointment.service';
import { PoliceService } from './policies/policies.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { FeedbackService } from 'src/client/feedback/feedback.service';
import { FeedbackEntity } from 'src/client/feedback/entities/feedback.entity';
import { DemarcationService } from './demarcation/demarcation.service';
//faq
import { FaqService } from './FAQ/faq.service';  // en minúsculas
import { Faq } from './FAQ/entities/faq.entity';  // también minúsculas


//Entities
import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleTypeEntity } from './service/entities/vehicle.entity';
import { CorporateImage } from './corporateimage/entities/corporateimage.entity';
import { Contact } from './contact/entities/contacts.entity';
import { AppointmentEntity } from 'src/employ/appointment/entities/appointment.entity';
import { AppointmentCancellationEntity } from 'src/employ/appointment/entities/appointment-cancellation-entity';
import { AppointmentRejectionEntity } from 'src/employ/appointment/entities/appointment-rejection-entity';
import { AppointmentServiceEntity } from 'src/employ/appointment/entities/appointment-services-entity';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { QuestionSecretEntity } from 'src/public/register/entity/question-secret.entity';
import { VehicleEntity } from 'src/client/vehicles/entities/vehicle.entity';
import { RepairEntity } from 'src/employ/repair/entities/repair.entity';
import { Police } from './policies/entities/policies.entity';
import { RepairPaymentEntity } from 'src/client/repair-payment/entity/repair.entity';
import { Pago } from 'src/mercado-pago/entity/pago.entity';
import { StateRepairEntity } from 'src/mercado-pago/pago/pagado.entity';
import { AcceptCashService } from './accept-cash/accept-cash.service';
import { RepairClientViewEntity } from './accept-cash/view/repair-client-view.entity';
import { AppointmentClient } from 'src/client/appointment-client/entity/appointment-client.entity';
import { AppointmentServiceClient } from 'src/client/appointment-client/entity/appointment-client-service.entity';
import { AppointmentCancellation } from 'src/client/appointment-client/entity/appointment-cancellation.entity';

//Views
import { AppointmentWaitingViewEntity } from 'src/employ/entities-view/appointment_waiting_view';
import { AppointmentServicesViewEntity } from 'src/employ/entities-view/appointment_services_view';
import { UserViewEntity } from 'src/public/register/view/vw-users-entity';
import { UserVehicleViewEntity } from 'src/employ/entities-view/user-vehicle.view.entity';
import { CancelledAppointmentsViewEntity } from 'src/employ/entities-view/appointments_cancelled_view';
import { VwAppointmentDetails } from 'src/client/appointment-client/view/vw-appointment-details.entity';
import {AppointmentPendingChangeViewEntity} from 'src/employ/entities-view/appointment_change_view';
import { VistaRepairsEmpleados } from 'src/client/history-repairs/view/vista_repairs_empleados';

import {SmartwatchLinkEntity} from 'src/client/smartwatch/smartwatch-link.entity';
import {NotificationService} from 'src/client/smartwatch/notification.service';
import { AppointmentReminderEntity } from 'src/employ/appointment/entities/appointment-reminder.entity'
import { DemarcationEntity } from './demarcation/entities/demarcation.entity';
import { SecurityPolicyService } from './security_policy/securityPolicy.service';
import { SecurityPolicyEntity } from './security_policy/entities/securityPolicy.entity';
import { TermsEntity } from './terms/entities/terms.entity';
import { TermsService } from './terms/terms.service';

//quiz
import { QuizQuestionService } from './quizQuestion/quizQuestion.service';
import { QuizQuestion } from './quizQuestion/entities/quizQuestion.entity';
import { QuizContactService } from './quizContact/quizContact.service';
import { QuizContact } from './quizContact/entities/quizContact.entity';



@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME_ADMIN'),
        password: configService.get<string>('DB_PASSWORD_ADMIN'),
        database: configService.get<string>('DB_NAME'),
        entities: [ServiceEntity, BrandEntity, VehicleTypeEntity, CorporateImage, Contact,
          AppointmentWaitingViewEntity, AppointmentEntity, AppointmentCancellationEntity, AppointmentRejectionEntity,
          AppointmentService, AppointmentServiceEntity, AppointmentServicesViewEntity, AuthorizedPersonnelEntity,
          QuestionSecretEntity, ClientEntity, VehicleEntity, UserViewEntity, UserVehicleViewEntity, RepairEntity,
          CancelledAppointmentsViewEntity, Police,VwAppointmentDetails,RepairPaymentEntity,Pago,StateRepairEntity,
          RepairClientViewEntity,VistaRepairsEmpleados,AppointmentClient,AppointmentServiceClient,AppointmentCancellation,
          AppointmentPendingChangeViewEntity, SmartwatchLinkEntity, AppointmentReminderEntity, FeedbackEntity, DemarcationEntity,
          SecurityPolicyEntity, TermsEntity, Faq, QuizQuestion, QuizContact,

        ],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([ServiceEntity, BrandEntity, VehicleTypeEntity, CorporateImage, Contact,
      AppointmentWaitingViewEntity, AppointmentEntity, AppointmentCancellationEntity, AppointmentRejectionEntity,
      AppointmentService, AppointmentServiceEntity, AppointmentServicesViewEntity, AuthorizedPersonnelEntity,
      QuestionSecretEntity, ClientEntity, VehicleEntity, UserViewEntity, UserVehicleViewEntity, RepairEntity,
      CancelledAppointmentsViewEntity, Police,VwAppointmentDetails,RepairPaymentEntity,Pago,StateRepairEntity,
      RepairClientViewEntity,VistaRepairsEmpleados,AppointmentClient,AppointmentServiceClient,AppointmentCancellation,
      AppointmentPendingChangeViewEntity,  SmartwatchLinkEntity, AppointmentReminderEntity, FeedbackEntity, DemarcationEntity, 
      SecurityPolicyEntity, TermsEntity, Faq, QuizQuestion, QuizContact

    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { /*expiresIn: '1h'*/ },
    })
  ],
  controllers: [AdminController],
  providers: [ServiceService, ContactService, CorporateimageService, PoliceService,LoggerService, AcceptCashService, NotificationService, FeedbackService,  DemarcationService,
    SecurityPolicyService, TermsService, FaqService,  QuizQuestionService, QuizContactService,],
  exports: [ServiceService, CorporateimageService, FaqService, QuizQuestionService, QuizContactService,], // Exporta si se necesita en otros módulos
})
export class AdminModule implements OnModuleInit {
  onModuleInit() {
    console.log('Modulo admin en uso')
  }
}
