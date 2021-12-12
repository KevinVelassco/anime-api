import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Origin } from './origin.entity';
import { FindOneOriginInput } from './dto/find-one-origin-input.dto';
import { FindAllOriginsInput } from './dto/find-all-origins-input.dto';

@Injectable()
export class OriginService {
  constructor(
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>
  ) {}

  public async findAll(findAllOriginsInput: FindAllOriginsInput): Promise<any> {
    const { limit = 10, skip = 0, q } = findAllOriginsInput;

    let where: any;

    if (q) where = { name: ILike(`%${q}%`) };

    const items = await this.originRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return items;
  }

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
