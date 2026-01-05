import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConfirmVerificationDto {
  @IsString()
  @IsNotEmpty()
  verificationId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
    