import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { FindAllOutPut } from '../../common/dto/find-all-output.dto';
import { FindAllCharactersInput } from './dto/find-all-characters-input.dto';
import { FindOneCharacterInput } from './dto/find-one-character-input.dto';

@ApiTags('character')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Public()
  @Get()
  findAll(
    @Query() findAllCharactersInput: FindAllCharactersInput
  ): Promise<FindAllOutPut> {
    return this.characterService.findAll(findAllCharactersInput);
  }

  @Public()
  @Get(':uid')
  findOne(
    @Param() findOneCharacterInput: FindOneCharacterInput
  ): Promise<Character | null> {
    return this.characterService.findOne(findOneCharacterInput);
  }
}
