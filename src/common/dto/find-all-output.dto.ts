import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class FindAllOutPut {
  @ApiProperty()
  @IsNumber()
  readonly count: number;

  @ApiProperty()
  @IsArray()
  readonly results: any[];
}
