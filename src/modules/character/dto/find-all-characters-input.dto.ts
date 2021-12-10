import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

import { CharacterGender, CharacterStatus } from '../character.entity';

export class FindAllCharactersInput {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly skip?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CharacterStatus)
  readonly status?: CharacterStatus;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CharacterGender)
  readonly gender?: CharacterGender;
}
