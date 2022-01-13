import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class FindOneUserInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly authUid: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
