import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetAuthPasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly confirmedPassword: string;
}
