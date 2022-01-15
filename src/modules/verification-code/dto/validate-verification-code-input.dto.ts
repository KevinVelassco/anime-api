import { VerificationCodeType } from '../verification-code.entity';

export class ValidateVerificationCodeInput {
  readonly code: string;
  readonly type: VerificationCodeType;
}
