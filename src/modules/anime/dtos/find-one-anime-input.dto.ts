import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneAnimeInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly uid: string;
}
