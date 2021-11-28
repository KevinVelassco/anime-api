import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateImageInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly url: string;
}
