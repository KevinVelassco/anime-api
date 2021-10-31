import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from './anime.entity';
import { FindOneAnimeInput } from './dtos/find-one-anime-input.dto';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>
  ) {}

  public async findOne(
    findOneAnimeInput: FindOneAnimeInput
  ): Promise<Anime | null> {
    const { uid, checkIfExists = true } = findOneAnimeInput;

    const anime = await this.animeRepository.findOne({ where: { uid } });

    if (checkIfExists && !anime) {
      throw new NotFoundException(`can't get the anime with uuid ${uid}.`);
    }

    return anime || null;
  }
}
