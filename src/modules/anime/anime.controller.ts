import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Anime } from './anime.entity';
import { AnimeService } from './anime.service';
import { FindOneAnimeInput } from './dtos/find-one-anime-input.dto';

@ApiTags('users')
@Controller('anime')
export class AnimeController {
  constructor(private animeService: AnimeService) {}

  @Get(':uid')
  findOne(
    @Param() findOneAnimeInput: FindOneAnimeInput
  ): Promise<Anime | null> {
    return this.animeService.findOne(findOneAnimeInput);
  }
}
