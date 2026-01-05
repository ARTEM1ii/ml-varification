import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { VerificationRepository } from './repositories/verification.repository';
import { VerificationEntity } from './entities/verification.entity';
import { VerificationStatus } from './enums/verification-status.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly CODE_TTL_MINUTES = 10;
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    private readonly repo: VerificationRepository,
    private readonly mailService: MailService,
  ) {}

  async requestVerification(email: string): Promise<{ verificationId: string; expiresAt: Date; code?: string }> {
    const verificationId = uuidv4();
    const code = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + this.CODE_TTL_MINUTES * 60 * 1000);

    const entity = new VerificationEntity(
      verificationId,
      email,
      code,
      VerificationStatus.PENDING,
      0,
      expiresAt,
    );

    await this.repo.save(entity);

    const isTransporterInitialized = this.mailService.isTransporterInitialized();

    try {
      await this.mailService.sendEmailVerificationCode(email, code);
    } catch (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`, error.stack);
      const isTestEnvironment = process.env.EMAIL_HOST?.includes('example.com') || 
                                process.env.NODE_ENV === 'development';
      
      if (isTransporterInitialized && !isTestEnvironment) {
        await this.repo.delete(verificationId);
        throw new BadRequestException('Failed to send verification email');
      }
      
      this.logger.warn('Email sending failed, returning code for development');
      return { verificationId, expiresAt, code };
    }

    if (!isTransporterInitialized) {
      return { verificationId, expiresAt, code };
    }

    return { verificationId, expiresAt };
  }

  async confirmVerification(verificationId: string, code: string): Promise<{ status: VerificationStatus }> {
    const entity = await this.repo.findById(verificationId);
    if (!entity) {
      throw new NotFoundException('Verification not found');
    }

    const finalStatuses = [
      VerificationStatus.VERIFIED,
      VerificationStatus.FAILED,
      VerificationStatus.EXPIRED,
    ];

    if (finalStatuses.includes(entity.status)) {
      return { status: entity.status };
    }

    if (entity.expiresAt.getTime() < Date.now()) {
      entity.status = VerificationStatus.EXPIRED;
      await this.repo.update(entity);
      return { status: entity.status };
    }

    if (entity.attempts >= this.MAX_ATTEMPTS) {
      entity.status = VerificationStatus.FAILED;
      await this.repo.update(entity);
      return { status: entity.status };
    }

    if (entity.code !== code) {
      entity.attempts += 1;

      if (entity.attempts >= this.MAX_ATTEMPTS) {
        entity.status = VerificationStatus.FAILED;
      }

      await this.repo.update(entity);
      throw new BadRequestException('Invalid code');
    }

    entity.status = VerificationStatus.VERIFIED;
    entity.code = '';
    await this.repo.update(entity);

    return { status: entity.status };
  }
}