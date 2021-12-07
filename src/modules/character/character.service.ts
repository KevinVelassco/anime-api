import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RaceService } from '../race/race.service';

import { Character } from './character.entity';
import { CreateCharacterInput } from './dto/create-character-input.dto';
import { FindAllCharactersInput } from './dto/find-all-characters-input.dto';
import { FindOneCharacterInput } from './dto/find-one-character-input.dto';
import { GetCharacterByUidInput } from './dto/get-character-by-uid-input.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly raceService: RaceService
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
        relations: ['assignedImages', 'assignedImages.image']
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
      relations: ['assignedImages', 'assignedImages.image']
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

      const { id, createdAt, updatedAt, assignedImages, ...data } = character;

      item = { ...data, image };
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
    const { raceUid, name } = createCharacterInput;

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

    const created = this.characterRepository.create({
      ...createCharacterInput,
      race
    });

    const saved = await this.characterRepository.save(created);

    return saved;
  }
}
