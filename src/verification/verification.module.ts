import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { VerificationRepository } from './repositories/verification.repository';
import { InMemoryVerificationRepository } from './repositories/in-memory-verification.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [VerificationController],
  providers: [
    VerificationService,
    {
      provide: VerificationRepository,
      useClass: InMemoryVerificationRepository,
    },
  ],
  exports: [VerificationRepository],
})
export class VerificationModule {}