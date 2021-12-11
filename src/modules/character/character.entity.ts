import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { AssignedImage } from '../assigned-image/assigned-image.entity';
import { Race } from '../race/race.entity';

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
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: CharacterStatus,
    default: CharacterStatus.ALIVE
  })
  status: CharacterStatus;

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
  @Column({ name: 'profile_image', type: 'varchar', length: 400 })
  profileImage: string;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Race, (race: Race) => race.characters, { nullable: false })
  @JoinColumn({ name: 'race_id' })
  race: Race;

  @OneToMany(
    () => AssignedImage,
    (assignedImage: AssignedImage) => assignedImage.character
  )
  assignedImages: AssignedImage[];
}
