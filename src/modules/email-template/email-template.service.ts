import * as mjml2html from 'mjml';
import hbs from 'handlebars';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { EmailTemplate } from './email-template.entity';
import { CreateEmailTemplateInput } from './dto/create-email-template-input.dto';
import { FindAllEmailTemplatesInput } from './dto/find-all-email-templates-input.dto';
import { GenerateTemplateHtmlInput } from './dto/generate-template-html-input.dto';
import { GenerateTemplateHtmlOutput } from './dto/generate-template-html-output.dto';
import { FindOneEmailTemplateInput } from './dto/find-one-email-template-input.dto';
import { UpdateEmailTemplateInput } from './dto/update-email-template-input.dto';
import { UploadFile } from '../../common/interfaces/upload-file.interface';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>
  ) {}

  public async findAll(
    findAllEmailTemplatesInput: FindAllEmailTemplatesInput
  ): Promise<any> {
    const { limit = 10, skip = 0, q } = findAllEmailTemplatesInput;

    let where: any;

    if (q) where = { subject: ILike(`%${q}%`) };

    const items = await this.emailTemplateRepository.findAndCount({
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
    findOneEmailTemplateInput: FindOneEmailTemplateInput
  ): Promise<EmailTemplate | null> {
    const { uid, checkIfExists = false } = findOneEmailTemplateInput;

    const item = await this.emailTemplateRepository.findOne({
      where: { uid }
    });

    if (checkIfExists && !item) {
      throw new NotFoundException(
        `can't get the email template with uid ${uid}.`
      );
    }

    return item || null;
  }

  public async create(
    createEmailTemplateInput: CreateEmailTemplateInput
  ): Promise<EmailTemplate> {
    const { type, subject } = createEmailTemplateInput;

    const existingEmailTemplate = await this.emailTemplateRepository.findOne({
      where: { type }
    });

    if (existingEmailTemplate) {
      throw new ConflictException('email template already exists');
    }

    const created = this.emailTemplateRepository.create({
      type,
      subject
    });

    const saved = await this.emailTemplateRepository.save(created);

    return saved;
  }

  public async update(
    findOneEmailTemplateInput: FindOneEmailTemplateInput,
    updateEmailTemplateInput: UpdateEmailTemplateInput
  ): Promise<EmailTemplate> {
    const { uid } = findOneEmailTemplateInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    const { type } = updateEmailTemplateInput;

    if (type) {
      const existingEmailTemplate = await this.emailTemplateRepository.findOne({
        where: { type }
      });

      if (existingEmailTemplate) {
        throw new ConflictException('email template already exists');
      }
    }

    const preloaded = await this.emailTemplateRepository.preload({
      id: existing.id,
      ...updateEmailTemplateInput
    });

    const saved = await this.emailTemplateRepository.save(preloaded);

    return saved;
  }

  public async delete(
    findOneEmailTemplateInput: FindOneEmailTemplateInput
  ): Promise<EmailTemplate> {
    const { uid } = findOneEmailTemplateInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    const deleted = await this.emailTemplateRepository.softRemove(existing);

    return deleted;
  }

  public async generateTemplateHtml(
    generateTemplateHtmlInput: GenerateTemplateHtmlInput
  ): Promise<GenerateTemplateHtmlOutput> {
    const { type } = generateTemplateHtmlInput;

    const existingEmailTemplate = await this.emailTemplateRepository.findOne({
      where: { type }
    });

    if (!existingEmailTemplate) {
      throw new NotFoundException(
        `can't get the email template with type ${type}.`
      );
    }

    const { subject, file } = existingEmailTemplate;

    const emailTemplateString = file.toString('utf-8');

    // compile the template
    const template = hbs.compile(emailTemplateString);

    const { parameters } = generateTemplateHtmlInput;

    // get the result
    const result = template(parameters);

    // get the html
    const { html } = mjml2html(result);

    return {
      html,
      subject
    };
  }

  public async upload(
    findOneEmailTemplateInput: FindOneEmailTemplateInput,
    file: UploadFile
  ): Promise<EmailTemplate> {
    if (!file) throw new BadRequestException('file is required.');

    const { uid } = findOneEmailTemplateInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    try {
      const { originalname, mimetype } = file;

      if (mimetype !== 'application/octet-stream') {
        throw new BadRequestException('invalid mimetype');
      }

      const fileExtension = originalname.split('.').pop();

      if (fileExtension !== 'mjml') {
        throw new BadRequestException('invalid file type');
      }

      const preloaded = await this.emailTemplateRepository.preload({
        id: existing.id,
        file: file.buffer
      });

      const saved = await this.emailTemplateRepository.save(preloaded);

      return saved;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
