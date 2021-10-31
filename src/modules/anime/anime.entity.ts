import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

@Entity('animes')
@Unique('uq_uid', ['uid'])
@Unique('uq_name', ['name'])
export class Anime {
  @Exclude()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uid: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
