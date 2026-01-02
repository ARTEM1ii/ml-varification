import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from './verification/verification.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VerificationModule,
    MailModule,
  ],
})
export class AppModule {}