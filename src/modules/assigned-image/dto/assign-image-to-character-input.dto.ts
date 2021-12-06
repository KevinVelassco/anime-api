import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignImageToCharacterInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly characterUid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly imageUid: string;
}
