import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../user/user.entity';

export enum VerificationCodeType {
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

@Entity('verification_codes')
@Unique('uq_verification_code_uid', ['uid'])
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uid: string;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate: Date;

  @Column({
    type: 'enum',
    enum: VerificationCodeType,
    default: VerificationCodeType.CONFIRM_EMAIL
  })
  type: VerificationCodeType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user: User) => user.verificationCodes, {
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
