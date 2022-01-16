import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import appConfig from '../../config/app.config';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/jwt-payload.type';
import { Tokens } from './types/tokens.type';
import { ChangeAuthPasswordInput } from './dto/change-auth-password-input.dto';
import { SendAuthPasswordUpdateEmailInput } from './dto/send-auth-password-update-email-input.dto';
import { MailgunService } from '../../common/plugins/mailgun/mailgun.service';
import { EmailTemplateService } from '../email-template/email-template.service';
import { TemplateType } from '../email-template/email-template.entity';
import { SendResetAuthPasswordEmailInput } from './dto/send-reset-auth-password-email-input.dto';
import { MessageOutput } from '../../common/dto/message-output.dto';
import { VerificationCodeService } from '../verification-code/verification-code.service';
import { VerificationCodeType } from '../verification-code/verification-code.entity';
import { addTimeToDate, TimeType } from '../../utils';
import { ResetAuthPasswordInput } from './dto/reset-auth-password-input.dto';
import { SendAuthEmailChangeNotificationInput } from './dto/send-auth-email-change-notification-input.dto';
import { SendAuthConfirmationEmailInput } from './dto/send-auth-confirmation-email-input.dto';
import { ChangeAuthEmailInput } from './dto/change-auth-email-Input.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly mailgunService: MailgunService,
    private readonly verificationCodeService: VerificationCodeService
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail({ email });

    const checkPassword = await user.checkPassword(password);

    if (user && checkPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  public async login(user: User): Promise<Tokens> {
    return this.getTokens(user);
  }

  public async refreshTokens(user: User): Promise<Tokens> {
    return this.getTokens(user);
  }

  public getTokens(user: User): Tokens {
    const payload: JwtPayload = { authUid: user.authUid, name: user.name };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfiguration.app.accessTokenSecret,
      expiresIn: this.appConfiguration.app.accessTokenExpiration
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfiguration.app.refreshTokenSecret,
      expiresIn: this.appConfiguration.app.refreshTokenExpiration
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  public async changePassword(
    user: User,
    changeAuthPasswordInput: ChangeAuthPasswordInput
  ): Promise<MessageOutput> {
    const { authUid, email } = changeAuthPasswordInput;

    if (authUid !== user.authUid) {
      throw new ConflictException('invalid authUid.');
    }

    if (email !== user.email) {
      throw new ConflictException('invalid email.');
    }

    const existing = await this.userService.getUserByAuthUidAndEmail({
      authUid,
      email,
      checkIfExists: true
    });

    const { oldPassword } = changeAuthPasswordInput;

    const isValidPassword = await existing.checkPassword(oldPassword);

    if (!isValidPassword) {
      throw new ConflictException('old password is invalid.');
    }

    const { newPassword } = changeAuthPasswordInput;

    const isSameOldPassword = await existing.checkPassword(newPassword);

    if (isSameOldPassword) {
      throw new ConflictException(
        'the new password must be different from the old one.'
      );
    }

    const preloaded = await this.userRepository.preload({
      id: existing.id,
      password: newPassword
    });

    await this.userRepository.save(preloaded);

    this.sendPasswordUpdateEmail({ email, authUid }).catch(console.error);

    return { message: 'password changed successfully.' };
  }

  private async sendPasswordUpdateEmail(
    sendAuthPasswordUpdateEmailInput: SendAuthPasswordUpdateEmailInput
  ): Promise<void> {
    const { authUid, email } = sendAuthPasswordUpdateEmailInput;

    const existing = await this.userService.getUserByAuthUidAndEmail({
      authUid,
      email,
      checkIfExists: true
    });

    const { subject, html } =
      await this.emailTemplateService.generateTemplateHtml({
        type: TemplateType.PASSWORD_UPDATED_EMAIL,
        parameters: {
          email,
          name: existing.name,
          link: `${this.appConfiguration.app.selftWebUrl}recover-password`
        }
      });

    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      to: email,
      subject,
      html
    });
  }

  public async sendResetPasswordEmail(
    sendResetAuthPasswordEmailInput: SendResetAuthPasswordEmailInput
  ): Promise<MessageOutput> {
    const { email } = sendResetAuthPasswordEmailInput;

    const existing = await this.userService.getUserByEmail({ email });

    if (!existing) {
      throw new NotFoundException(`can't get the user with email ${email}`);
    }

    const currentDate = new Date();

    const verificationCode = await this.verificationCodeService.create({
      type: VerificationCodeType.RESET_PASSWORD,
      expirationDate: addTimeToDate(currentDate, 1, TimeType.Days),
      user: existing
    });

    const { subject, html } =
      await this.emailTemplateService.generateTemplateHtml({
        type: TemplateType.RESET_PASSWORD_EMAIL,
        parameters: {
          email,
          name: existing.name,
          link: `${this.appConfiguration.app.selftWebUrl}change-password?code=${verificationCode.code}`
        }
      });

    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      to: email,
      subject,
      html
    });

    return { message: 'password reset instructions email sent.' };
  }

  public async resetPassword(
    resetAuthPasswordInput: ResetAuthPasswordInput
  ): Promise<MessageOutput> {
    const { code } = resetAuthPasswordInput;

    const verificationCode = await this.verificationCodeService.validate({
      code,
      type: VerificationCodeType.RESET_PASSWORD
    });

    const { password, confirmedPassword } = resetAuthPasswordInput;

    if (password !== confirmedPassword) {
      throw new BadRequestException('the passwords do not match.');
    }

    const { user } = verificationCode;

    const preloaded = await this.userRepository.preload({
      id: user.id,
      password
    });

    await this.userRepository.save(preloaded);

    await this.verificationCodeService.delete({ uid: verificationCode.uid });

    const { email, authUid } = user;

    this.sendPasswordUpdateEmail({ email, authUid }).catch(console.error);

    return { message: 'password changed successfully.' };
  }

  public async sendEmailChangeNotification(
    sendAuthEmailChangeNotificationInput: SendAuthEmailChangeNotificationInput
  ): Promise<MessageOutput> {
    const { authUid, oldEmail } = sendAuthEmailChangeNotificationInput;

    const existing = await this.userService.findOne({
      authUid,
      checkIfExists: true
    });

    const { subject, html } =
      await this.emailTemplateService.generateTemplateHtml({
        type: TemplateType.EMAIL_CHANGE_NOTIFICATION_EMAIL,
        parameters: {
          name: existing.name
        }
      });

    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      to: oldEmail,
      subject,
      html
    });

    return {
      message: 'email for email change notification sent.'
    };
  }

  public async sendConfirmationEmail(
    sendAuthConfirmationEmailInput: SendAuthConfirmationEmailInput
  ): Promise<MessageOutput> {
    const { authUid } = sendAuthConfirmationEmailInput;

    const user = await this.userService.findOne({
      authUid,
      checkIfExists: true
    });

    const currentDate = new Date();

    const verificationCode = await this.verificationCodeService.create({
      type: VerificationCodeType.CONFIRM_EMAIL,
      expirationDate: addTimeToDate(currentDate, 1, TimeType.Days),
      user
    });

    const { name, email } = user;

    const { subject, html } =
      await this.emailTemplateService.generateTemplateHtml({
        type: TemplateType.CONFIRMATION_EMAIL,
        parameters: {
          email,
          name,
          link: `${this.appConfiguration.app.selftWebUrl}confirm-email?code=${verificationCode.code}`
        }
      });

    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      to: email,
      subject,
      html
    });

    return {
      message: 'email to confirm email sent.'
    };
  }

  public async changeEmail(
    user: User,
    changeAuthEmailInput: ChangeAuthEmailInput
  ): Promise<MessageOutput> {
    const { authUid } = changeAuthEmailInput;

    if (authUid !== user.authUid) {
      throw new ConflictException('invalid authUid.');
    }

    const existingUser = await this.userService.findOne({
      authUid,
      checkIfExists: true
    });

    const { email } = changeAuthEmailInput;

    if (existingUser.email === email) {
      throw new NotFoundException(
        'the new email must be different from the old one.'
      );
    }

    const existingUserWithSameEmail = await this.userService.getUserByEmail({
      email
    });

    if (existingUserWithSameEmail) {
      throw new ConflictException(`the email ${email} it's already used.`);
    }

    const oldEmail = existingUser.email;

    const preloaded = await this.userRepository.preload({
      id: existingUser.id,
      email,
      verifiedEmail: false
    });

    await this.userRepository.save(preloaded);

    this.sendEmailChangeNotification({
      oldEmail,
      authUid
    }).catch(console.error);

    this.sendConfirmationEmail({
      authUid
    }).catch(console.error);

    return { message: 'email change successful.' };
  }
}
