import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { FindAllRacesInput } from './dto/find-all-races-input.dto';
import { Race } from './race.entity';

@Injectable()
export class RaceService {
  constructor(
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>
  ) {}

  public async findAll(findAllRacesInput: FindAllRacesInput): Promise<any> {
    const { limit = 10, skip = 0, q } = findAllRacesInput;

    let where: any;

    if (q) where = { name: ILike(`%${q}%`) };

    const items = await this.raceRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return items;
  }
}
