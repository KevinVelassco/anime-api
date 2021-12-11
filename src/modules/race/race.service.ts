import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Race } from './race.entity';
import { FindAllRacesInput } from './dto/find-all-races-input.dto';
import { FindOneRaceInput } from './dto/find-one-race-input.dto';
import { CreateRaceInput } from './dto/create-race-input.dto';
import { UpdateRaceInput } from './dto/update-race-input.dto';

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

  public async create(createRaceInput: CreateRaceInput): Promise<Race> {
    const { name } = createRaceInput;

    const existingByName = await this.raceRepository
      .createQueryBuilder('r')
      .where('upper(r.name) = upper(:name)', { name })
      .getOne();

    if (existingByName) {
      throw new ConflictException(`already exists a race with name ${name}`);
    }

    const created = this.raceRepository.create(createRaceInput);
    const saved = await this.raceRepository.save(created);
    return saved;
  }

  public async update(
    findOneRaceInput: FindOneRaceInput,
    updateRaceInput: UpdateRaceInput
  ): Promise<Race> {
    const { uid } = findOneRaceInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    const { name } = updateRaceInput;

    const existingByName = await this.raceRepository
      .createQueryBuilder('r')
      .where('upper(r.name) = upper(:name)', { name })
      .getOne();

    if (existingByName) {
      throw new ConflictException(`already exists a race with name ${name}`);
    }

    const preloaded = await this.raceRepository.preload({
      id: existing.id,
      ...updateRaceInput
    });

    const saved = await this.raceRepository.save(preloaded);
    return saved;
  }

  public async delete(findOneRaceInput: FindOneRaceInput): Promise<Race> {
    const { uid } = findOneRaceInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    const deleted = await this.raceRepository.remove(existing);

    return deleted;
  }
}
