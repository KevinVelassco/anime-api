import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangeAuthPasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly authUid: string;
}
