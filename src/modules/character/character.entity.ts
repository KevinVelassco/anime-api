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

export enum CharacterStatus {
  ALIVE = 'Alive',
  DEAD = 'Dead',
  UNKNOWM = 'Unknown'
}

export enum CharacterGender {
  FEMALE = 'Female',
  MALE = 'Male',
  UNKNOWM = 'Unknown'
}

@Entity('characters')
@Unique('uq_character_uid', ['uid'])
@Unique('uq_character_name', ['name'])
export class Character {
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
  @Column({
    type: 'enum',
    enum: CharacterStatus,
    default: CharacterStatus.ALIVE
  })
  status: CharacterStatus;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  species: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: CharacterGender
  })
  gender: CharacterGender;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  origin: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 400, nullable: true })
  image?: string;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
