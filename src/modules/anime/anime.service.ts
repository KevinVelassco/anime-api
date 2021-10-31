import { Injectable } from '@nestjs/common';
import { Anime } from './anime.entity';
import { FindOneAnimeInput } from './dtos/find-one-anime-input.dto';

@Injectable()
export class AnimeService {
  findOne(findOneAnimeInput: FindOneAnimeInput): Anime {
    const { uid } = findOneAnimeInput;
    return { id: 1, uid: uid, name: 'one piece' };
  }
}
