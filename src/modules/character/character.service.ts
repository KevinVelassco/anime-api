import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { FindAllOutPut } from '../../common/dto/find-all-output.dto';
import { Character } from './character.entity';
import { FindAllCharactersInput } from './dto/find-all-characters-input.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>
  ) {}

  public async findAll(
    findAllCharactersInput: FindAllCharactersInput
  ): Promise<FindAllOutPut> {
    const { limit = 10, skip = 0, ...filters } = findAllCharactersInput;

    let where: any = { ...filters };

    if (where.name) where = { ...filters, name: ILike(`%${filters.name}%`) };

    const [results, count] = await this.characterRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return { count, results };
  }
}
