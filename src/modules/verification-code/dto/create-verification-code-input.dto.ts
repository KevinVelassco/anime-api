import { User } from '../../user/user.entity';
import { VerificationCodeType } from '../verification-code.entity';

export class CreateVerificationCodeInput {
  readonly expirationDate: Date;
  readonly type: VerificationCodeType;
  readonly user: User;
}
