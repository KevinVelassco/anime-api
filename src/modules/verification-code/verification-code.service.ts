import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateUuid } from '../../utils';
import { VerificationCode } from './verification-code.entity';
import { CreateVerificationCodeInput } from './dto/create-verification-code-input.dto';
import { ValidateVerificationCodeInput } from './dto/validate-verification-code-input.dto';
import { FindOneVerificationCodeInput } from './dto/find-one-verification-code-input.dto';

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

  public async validate(
    validateVerificationCodeInput: ValidateVerificationCodeInput
  ): Promise<VerificationCode> {
    const { code } = validateVerificationCodeInput;

    const existing = await this.verificationCodeRepository.findOne({
      where: {
        code
      },
      relations: ['user']
    });

    if (!existing) {
      throw new NotFoundException(
        `the code ${code} is invalid, probably because it was already used.`
      );
    }

    const currentDate = new Date();

    const { expirationDate } = existing;

    if (currentDate.getTime() > expirationDate.getTime()) {
      throw new ConflictException(`the verification code ${code} is expired.`);
    }

    const { type } = validateVerificationCodeInput;

    if (type !== existing.type) {
      throw new ConflictException(
        `the verification code ${code} doesn't have the expected type.`
      );
    }

    return existing;
  }

  public async delete(
    findOneVerificationCodeInput: FindOneVerificationCodeInput
  ) {
    const { uid } = findOneVerificationCodeInput;

    const existing = await this.verificationCodeRepository.findOne({
      where: { uid }
    });

    if (!existing)
      throw new NotFoundException(
        `can't get the verification code with uid ${uid}`
      );

    const deleted = await this.verificationCodeRepository.softRemove(existing);

    return deleted;
  }
}
