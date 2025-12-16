import { VerificationStatus } from '../enums/verification-status.enum';

export class VerificationEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public code: string,
    public status: VerificationStatus,
    public attempts: number,
    public expiresAt: Date,
    public confidence?: number,
  ) {}
}