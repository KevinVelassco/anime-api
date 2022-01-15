import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendResetAuthPasswordEmailInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
