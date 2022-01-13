import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class GetUserByAuthUidAndEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly authUid: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
