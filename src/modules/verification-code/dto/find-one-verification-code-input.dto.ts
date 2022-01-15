import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneVerificationCodeInput {
  @IsNotEmpty()
  @IsString()
  readonly uid: string;
}
