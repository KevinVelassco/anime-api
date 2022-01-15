import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

const Mailgun = require('mailgun.js');
import * as formData from 'form-data';

import appConfig from '../../../config/app.config';
import { SendEmailInput } from './dto/send-email-input.dto';

@Injectable()
export class MailgunService {
  private mg;

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    const mailgun = new Mailgun(formData);

    this.mg = mailgun.client({
      username: 'api',
      key: this.appConfiguration.mailgun.privateKey
      // public_key: this.appConfiguration.mailgun.publicKey
    });
  }

  public async sendEmail(sendEmailInput: SendEmailInput): Promise<void> {
    const { subject } = sendEmailInput;

    const subjectToUse =
      this.appConfiguration.environment === 'production'
        ? subject
        : `${this.appConfiguration.environment} | ${subject}`;

    const msg = await this.mg.messages.create(
      this.appConfiguration.mailgun.domain,
      {
        from: sendEmailInput.from,
        to: sendEmailInput.to,
        subject: subjectToUse,
        text: sendEmailInput.text,
        html: sendEmailInput.html
      }
    );

    Logger.log(`${JSON.stringify(msg)}`);
  }
}
