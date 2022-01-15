import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendAuthPasswordUpdateEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly authUid: string;
}
