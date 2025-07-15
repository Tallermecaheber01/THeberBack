import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Global()
@Module({
  imports: [ConfigModule],  // para inyectar ConfigService
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: (config: ConfigService) => {
        const path = config.get<string>('FIREBASE_CRED_PATH');
        return admin.initializeApp({
          credential: admin.credential.cert(path),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_APP'],
})
export class FirebaseModule {}