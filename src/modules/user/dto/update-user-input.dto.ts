import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly password: string;
}
