import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { ILike, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user-input.dto';
import { FindAllUsersInput } from './dto/find-all-users-input.dto';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { GetUserByEmailInput } from './dto/get-user-by-email-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { GetUserByAuthUidAndEmailInput } from './dto/get-user-by-auth-uid-and-email-input.dto';
import { SendUserConfirmationEmailInput } from './dto/send-user-confirmation-email-input.dto';
import { MessageOutput } from '../../common/dto/message-output.dto';
import { VerificationCodeService } from '../verification-code/verification-code.service';
import { VerificationCodeType } from '../verification-code/verification-code.entity';
import { addTimeToDate, TimeType } from '../../utils';
import { EmailTemplateService } from '../email-template/email-template.service';
import { MailgunService } from '../../common/plugins/mailgun/mailgun.service';
import { TemplateType } from '../email-template/email-template.entity';
import appConfig from '../../config/app.config';

@Injectable()
export class UserService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly mailgunService: MailgunService
  ) {}

  public async findAll(findAllUsersInput: FindAllUsersInput): Promise<any> {
    const { limit = 10, skip = 0, q } = findAllUsersInput;

    let where: any;

    if (q) where = [{ name: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) }];

    const items = await this.userRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return items;
  }

  public async findOne(
    findOneUserInput: FindOneUserInput
  ): Promise<User | null> {
    const { authUid, checkIfExists = false } = findOneUserInput;

    const item = await this.userRepository.findOne({
      where: { authUid }
    });

    if (checkIfExists && !item) {
      throw new NotFoundException(
        `can't get the user with authUid ${authUid}.`
      );
    }

    return item || null;
  }

  public async create(createUserInput: CreateUserInput): Promise<User> {
    const { email } = createUserInput;

    const user = await this.getUserByEmail({ email });

    if (user) {
      throw new ConflictException(`already exists a user with email ${email}`);
    }

    const { isAdmin = false } = createUserInput;

    const created = this.userRepository.create({
      ...createUserInput,
      isAdmin,
      verifiedEmail: false
    });

    const saved = await this.userRepository.save(created);

    this.sendConfirmationEmail({
      authUid: saved.authUid
    }).catch(console.error);

    return saved;
  }

  public async update(
    findOneUserInput: FindOneUserInput,
    updateUserInput: UpdateUserInput
  ): Promise<User> {
    const { authUid } = findOneUserInput;

    const existing = await this.findOne({
      authUid,
      checkIfExists: true
    });

    const preloaded = await this.userRepository.preload({
      id: existing.id,
      ...updateUserInput
    });

    const saved = await this.userRepository.save(preloaded);
    return saved;
  }

  public async delete(findOneUserInput: FindOneUserInput): Promise<User> {
    const { authUid } = findOneUserInput;

    const existing = await this.findOne({
      authUid,
      checkIfExists: true
    });

    const deleted = await this.userRepository.softRemove(existing);

    return deleted;
  }

  public async getUserByEmail(
    getUserByEmailInput: GetUserByEmailInput
  ): Promise<User | null> {
    const { email } = getUserByEmailInput;

    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });

    return user || null;
  }

  public async getUserByAuthUidAndEmail(
    getUserByAuthUidAndEmailInput: GetUserByAuthUidAndEmailInput
  ): Promise<User | null> {
    const {
      authUid,
      email,
      checkIfExists = false
    } = getUserByAuthUidAndEmailInput;

    const user = await this.userRepository.findOne({
      where: {
        authUid,
        email
      }
    });

    if (checkIfExists && !user) {
      throw new NotFoundException(
        `can't get the user with email ${email} for the authUid ${authUid}.`
      );
    }

    return user || null;
  }

  public async sendConfirmationEmail(
    sendUserConfirmationEmailInput: SendUserConfirmationEmailInput
  ): Promise<MessageOutput> {
    const { authUid } = sendUserConfirmationEmailInput;

    const user = await this.findOne({
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
        type: TemplateType.WELCOME_EMAIL,
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
      message: 'welcome email sent.'
    };
  }
}
