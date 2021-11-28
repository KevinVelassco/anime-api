import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Race } from './race.entity';
import { FindAllRacesInput } from './dto/find-all-races-input.dto';
import { FindOneRaceInput } from './dto/find-one-race-input.dto';

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

  public async findOne(
    findOneRaceInput: FindOneRaceInput
  ): Promise<Race | null> {
    const { uid, checkIfExists = false } = findOneRaceInput;

    const item = await this.raceRepository.findOne({ where: { uid } });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the race with uuid ${uid}.`);
    }

    return item || null;
  }
}
