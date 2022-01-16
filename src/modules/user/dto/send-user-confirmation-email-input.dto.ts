import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendUserConfirmationEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly authUid: string;
}
