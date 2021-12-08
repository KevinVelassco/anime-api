import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { FindAllCharactersInput } from './dto/find-all-characters-input.dto';
import { FindOneCharacterInput } from './dto/find-one-character-input.dto';
import { CreateCharacterInput } from './dto/create-character-input.dto';
import { GetCharacterByUidInput } from './dto/get-character-by-uid-input.dto';
import { UpdateCharacterInput } from './dto/update-character-input.dto';

@ApiTags('character')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Public()
  @Get()
  findAll(
    @Query() findAllCharactersInput: FindAllCharactersInput
  ): Promise<any> {
    return this.characterService.findAll(findAllCharactersInput);
  }

  @Public()
  @Get(':uid')
  findOne(
    @Param() findOneCharacterInput: FindOneCharacterInput
  ): Promise<Character | null> {
    return this.characterService.findOne(findOneCharacterInput);
  }

  @Post()
  create(
    @Body() createCharacterInput: CreateCharacterInput
  ): Promise<Character> {
    return this.characterService.create(createCharacterInput);
  }

  @Put(':uid')
  update(
    @Param() getCharacterByUidInput: GetCharacterByUidInput,
    @Body() updateCharacterInput: UpdateCharacterInput
  ): Promise<Character> {
    return this.characterService.update(
      getCharacterByUidInput,
      updateCharacterInput
    );
  }

  @Delete(':uid')
  delete(
    @Param() findOneCharacterInput: FindOneCharacterInput
  ): Promise<Character> {
    return this.characterService.delete(findOneCharacterInput);
  }
}
