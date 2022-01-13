import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly name: string;
}
