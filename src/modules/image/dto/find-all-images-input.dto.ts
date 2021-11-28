import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FindAllImagesInput {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly skip?: number;
}
