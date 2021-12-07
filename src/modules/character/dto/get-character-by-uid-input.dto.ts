import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetCharacterByUidInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly uid: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  checkIfExists?: boolean;
}
