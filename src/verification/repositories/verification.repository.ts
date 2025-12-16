import { VerificationEntity } from '../entities/verification.entity';

export abstract class VerificationRepository {
  abstract save(entity: VerificationEntity): Promise<void>;

  abstract findById(id: string): Promise<VerificationEntity | null>;

  abstract update(entity: VerificationEntity): Promise<void>;

  abstract delete(id: string): Promise<void>;
}