import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RemoveAssignedImageFromCharacterInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly characterUid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly imageUid: string;
}
