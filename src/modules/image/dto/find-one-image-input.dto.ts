import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindOneImageInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly uid: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  checkIfExists?: boolean;
}
