import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CharacterController } from './character.controller';
import { Character } from './character.entity';
import { CharacterService } from './character.service';
import { RaceModule } from '../race/race.module';

@Module({
  imports: [TypeOrmModule.forFeature([Character]), RaceModule],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [CharacterService]
})
export class CharacterModule {}
