import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class FindOneEmailTemplateInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly uid: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
