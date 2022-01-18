import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmUserAuthEmailInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
