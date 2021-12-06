import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Character } from './character.entity';
import { FindAllCharactersInput } from './dto/find-all-characters-input.dto';
import { FindOneCharacterInput } from './dto/find-one-character-input.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>
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

    const item = await this.characterRepository.findOne({ where: { uid } });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the character with uuid ${uid}.`);
    }

    return item || null;
  }
}
