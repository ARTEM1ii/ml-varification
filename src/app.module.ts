import { Module } from '@nestjs/common';
import { VerificationModule } from './verification/verification.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [VerificationModule, MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
