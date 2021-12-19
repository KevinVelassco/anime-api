import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetUserByEmailInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  readonly email: string;
}
