import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { Anime } from './anime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anime])],
  controllers: [AnimeController],
  providers: [AnimeService]
})
export class AnimeModule {}
