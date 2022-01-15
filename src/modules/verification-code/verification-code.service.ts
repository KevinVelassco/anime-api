import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateUuid } from '../../utils';
import { VerificationCode } from './verification-code.entity';
import { CreateVerificationCodeInput } from './dto/create-verification-code-input.dto';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>
  ) {}

  public async create(
    createVerificationCodeInput: CreateVerificationCodeInput
  ): Promise<VerificationCode> {
    const created = this.verificationCodeRepository.create({
      ...createVerificationCodeInput,
      code: generateUuid(10)
    });

    const saved = await this.verificationCodeRepository.save(created);

    return saved;
  }
}
