import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendAuthConfirmationEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly authUid: string;
}
