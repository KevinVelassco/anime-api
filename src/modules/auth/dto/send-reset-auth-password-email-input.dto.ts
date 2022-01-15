import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendResetAuthPasswordEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
