import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendAuthEmailChangeNotificationInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly oldEmail: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly authUid: string;
}
