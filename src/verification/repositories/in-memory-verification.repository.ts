import { Injectable } from '@nestjs/common';
import { VerificationRepository } from './verification.repository';
import { VerificationEntity } from '../entities/verification.entity';

@Injectable()
export class InMemoryVerificationRepository
  implements VerificationRepository
{
  private readonly store = new Map<string, VerificationEntity>();

  async save(entity: VerificationEntity): Promise<void> {
    this.store.set(entity.id, entity);
  }

  async findById(id: string): Promise<VerificationEntity | null> {
    return this.store.get(id) ?? null;
  }

  async update(entity: VerificationEntity): Promise<void> {
    this.store.set(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}