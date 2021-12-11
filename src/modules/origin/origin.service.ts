import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Origin } from './origin.entity';
import { FindOneOriginInput } from './dto/find-one-origin-input.dto';

@Injectable()
export class OriginService {
  constructor(
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>
  ) {}

  public async findOne(
    findOneOriginInput: FindOneOriginInput
  ): Promise<Origin | null> {
    const { uid, checkIfExists = false } = findOneOriginInput;

    const item = await this.originRepository.findOne({ where: { uid } });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the origin with uuid ${uid}.`);
    }

    return item || null;
  }
}
