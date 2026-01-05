import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { RequestVerificationDto } from './dto/request-verification.dto';
import { ConfirmVerificationDto } from './dto/confirm-verification.dto';

@Controller('verification')
export class VerificationController {
  constructor(private readonly service: VerificationService) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  async request(@Body() dto: RequestVerificationDto) {
    return this.service.requestVerification(dto.email);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Body() dto: ConfirmVerificationDto) {
    return this.service.confirmVerification(dto.verificationId, dto.code);
  }
}