import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { OriginService } from '../origin/origin.service';

import { RaceService } from '../race/race.service';
import { Character } from './character.entity';
import { CreateCharacterInput } from './dto/create-character-input.dto';
import { FindAllCharactersInput } from './dto/find-all-characters-input.dto';
import { FindOneCharacterInput } from './dto/find-one-character-input.dto';
import { GetCharacterByUidInput } from './dto/get-character-by-uid-input.dto';
import { GetCharactersByOriginInput } from './dto/get-characters-by-origin-input.dto';
import { GetCharactersByRaceInput } from './dto/get-characters-by-race-input.dto';
import { UpdateCharacterInput } from './dto/update-character-input.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly raceService: RaceService,
    private readonly originService: OriginService
  ) {}

  public async findAll(
    findAllCharactersInput: FindAllCharactersInput
  ): Promise<any> {
    const { limit = 10, skip = 0, ...filters } = findAllCharactersInput;

    let where: any = { ...filters };

    if (where.name) where = { ...filters, name: ILike(`%${filters.name}%`) };

    const [characters, charactersCount] =
      await this.characterRepository.findAndCount({
        where,
        take: limit,
        skip,
        order: {
          id: 'DESC'
        },
        relations: ['race', 'origin', 'assignedImages', 'assignedImages.image']
      });

    const items = characters.map(
      ({ assignedImages, id, updatedAt, createdAt, ...character }) => {
        const image = assignedImages.map(assignedImage => assignedImage.image);
        return { ...character, image };
      }
    );

    return [items, charactersCount];
  }

  public async findOne(
    findOneCharacterInput: FindOneCharacterInput
  ): Promise<Character | null> {
    const { uid, checkIfExists = false } = findOneCharacterInput;

    const character = await this.characterRepository.findOne({
      where: { uid },
      relations: ['race', 'origin', 'assignedImages', 'assignedImages.image']
    });

    if (checkIfExists && !character) {
      throw new NotFoundException(`can't get the character with uuid ${uid}.`);
    }

    let item;

    if (character) {
      const image = character.assignedImages.map(({ image }) => ({
        uid: image.uid,
        url: image.url
      }));

      const { assignedImages, ...data } = character;

      item = plainToClass(Character, { ...data, image });
    }

    return item || null;
  }

  public async getCharacterByUid(
    getCharacterByUidInput: GetCharacterByUidInput
  ): Promise<Character | null> {
    const { uid, checkIfExists = false } = getCharacterByUidInput;

    const item = await this.characterRepository.findOne({ where: { uid } });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the character with uuid ${uid}.`);
    }

    return item || null;
  }

  public async create(
    createCharacterInput: CreateCharacterInput
  ): Promise<Character> {
    const { name, raceUid, originUid } = createCharacterInput;

    const existingByName = await this.characterRepository
      .createQueryBuilder('c')
      .where('upper(c.name) = upper(:name)', { name })
      .getOne();

    if (existingByName) {
      throw new ConflictException(
        `already exists a character with name ${name}`
      );
    }

    const race = await this.raceService.findOne({
      uid: raceUid,
      checkIfExists: true
    });

    const origin = await this.originService.findOne({
      uid: originUid,
      checkIfExists: true
    });

    const created = this.characterRepository.create({
      ...createCharacterInput,
      race,
      origin
    });

    const saved = await this.characterRepository.save(created);

    return saved;
  }

  public async update(
    getCharacterByUidInput: GetCharacterByUidInput,
    updateCharacterInput: UpdateCharacterInput
  ): Promise<Character> {
    const { uid } = getCharacterByUidInput;

    const existing = await this.getCharacterByUid({
      uid,
      checkIfExists: true
    });

    const { name } = updateCharacterInput;

    if (name) {
      const existingByName = await this.characterRepository
        .createQueryBuilder('c')
        .where('upper(c.name) = upper(:name)', { name })
        .getOne();

      if (existingByName) {
        throw new ConflictException(
          `already exists a character with name ${name}`
        );
      }
    }

    const { raceUid } = updateCharacterInput;

    let race;

    if (raceUid) {
      race = await this.raceService.findOne({
        uid: raceUid,
        checkIfExists: true
      });
    }

    const { originUid } = updateCharacterInput;

    let origin;

    if (originUid) {
      origin = await this.originService.findOne({
        uid: originUid,
        checkIfExists: true
      });
    }

    const updated = await this.characterRepository.preload({
      id: existing.id,
      ...updateCharacterInput,
      race,
      origin
    });

    const saved = await this.characterRepository.save(updated);

    return saved;
  }

  public async delete(
    findOneCharacterInput: FindOneCharacterInput
  ): Promise<Character> {
    const { uid } = findOneCharacterInput;

    const existing = await this.getCharacterByUid({
      uid,
      checkIfExists: true
    });

    const deleted = await this.characterRepository.remove(existing);

    return deleted;
  }

  public async getCharactersByRace(
    getCharactersByRaceInput: GetCharactersByRaceInput,
    findAllCharactersInput: FindAllCharactersInput
  ): Promise<any> {
    const { raceUid } = getCharactersByRaceInput;

    const race = await this.raceService.findOne({
      uid: raceUid,
      checkIfExists: true
    });

    const { limit = 10, skip = 0, ...filters } = findAllCharactersInput;

    let where: any = { ...filters, race };

    if (where.name) where = { ...where, name: ILike(`%${filters.name}%`) };

    const [characters, charactersCount] =
      await this.characterRepository.findAndCount({
        where,
        take: limit,
        skip,
        order: {
          id: 'DESC'
        },
        relations: ['origin', 'assignedImages', 'assignedImages.image']
      });

    const items = characters.map(
      ({ assignedImages, id, updatedAt, createdAt, ...character }) => {
        const image = assignedImages.map(assignedImage => assignedImage.image);
        return { ...character, image };
      }
    );

    return [items, charactersCount];
  }

  public async getCharactersByOrigin(
    getCharactersByOriginInput: GetCharactersByOriginInput,
    findAllCharactersInput: FindAllCharactersInput
  ): Promise<any> {
    const { originUid } = getCharactersByOriginInput;

    const origin = await this.originService.findOne({
      uid: originUid,
      checkIfExists: true
    });

    const { limit = 10, skip = 0, ...filters } = findAllCharactersInput;

    let where: any = { ...filters, origin };

    if (where.name) where = { ...where, name: ILike(`%${filters.name}%`) };

    const [characters, charactersCount] =
      await this.characterRepository.findAndCount({
        where,
        take: limit,
        skip,
        order: {
          id: 'DESC'
        },
        relations: ['race', 'assignedImages', 'assignedImages.image']
      });

    const items = characters.map(
      ({ assignedImages, id, updatedAt, createdAt, ...character }) => {
        const image = assignedImages.map(assignedImage => assignedImage.image);
        return { ...character, image };
      }
    );

    return [items, charactersCount];
  }
}
