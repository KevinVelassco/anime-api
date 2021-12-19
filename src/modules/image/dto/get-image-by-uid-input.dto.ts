import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetImageByUidInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly uid: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
