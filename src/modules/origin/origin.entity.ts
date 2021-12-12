import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Character } from '../character/character.entity';

@Entity('origin')
@Unique('uq_origin_uid', ['uid'])
@Unique('uq_origin_name', ['name'])
@Unique('uq_origin_image', ['image'])
export class Origin {
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

  @ApiProperty()
  @Column({ type: 'varchar', length: 400 })
  image: string;

  @Exclude()
  @ApiProperty()
  @Column({ name: 'cloud_id', type: 'varchar', length: 50, nullable: true })
  cloudId?: string;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Character, (character: Character) => character.origin)
  characters: Character[];
}
