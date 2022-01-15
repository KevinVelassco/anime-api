import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { EmailTemplate } from './email-template.entity';
import { EmailTemplateService } from './email-template.service';
import { Admin } from '../../common/decorators/admin.decorator';
import { UploadFile } from '../../common/interfaces/upload-file.interface';
import { CreateEmailTemplateInput } from './dto/create-email-template-input.dto';
import { FindAllEmailTemplatesInput } from './dto/find-all-email-templates-input.dto';
import { FindOneEmailTemplateInput } from './dto/find-one-email-template-input.dto';
import { UpdateEmailTemplateInput } from './dto/update-email-template-input.dto';

@ApiTags('email-template')
@Controller('email-template')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Admin()
  @Get()
  findAll(
    @Query() findAllEmailTemplatesInput: FindAllEmailTemplatesInput
  ): Promise<any> {
    return this.emailTemplateService.findAll(findAllEmailTemplatesInput);
  }

  @Admin()
  @Get(':uid')
  findOne(
    @Param() findOneEmailTemplateInput: FindOneEmailTemplateInput
  ): Promise<EmailTemplate | null> {
    return this.emailTemplateService.findOne(findOneEmailTemplateInput);
  }

  @Admin()
  @Post()
  create(
    @Body() createEmailTemplateInput: CreateEmailTemplateInput
  ): Promise<EmailTemplate> {
    return this.emailTemplateService.create(createEmailTemplateInput);
  }

  @Put(':uid')
  update(
    @Param() findOneEmailTemplateInput: FindOneEmailTemplateInput,
    @Body() updateEmailTemplateInput: UpdateEmailTemplateInput
  ): Promise<EmailTemplate> {
    return this.emailTemplateService.update(
      findOneEmailTemplateInput,
      updateEmailTemplateInput
    );
  }

  @Admin()
  @Delete(':uid')
  delete(
    @Param() findOneEmailTemplateInput: FindOneEmailTemplateInput
  ): Promise<EmailTemplate> {
    return this.emailTemplateService.delete(findOneEmailTemplateInput);
  }

  @Admin()
  @Put('upload/:uid')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param() findOneEmailTemplateInput: FindOneEmailTemplateInput,
    @UploadedFile() file: UploadFile
  ): Promise<EmailTemplate> {
    return this.emailTemplateService.upload(findOneEmailTemplateInput, file);
  }
}
