import { Controller, Post, Body, Headers } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailService) {}

  @Post('send')
  async sendMail(@Body() mailData: any) {
    return this.mailerService.sendMail(mailData);
  }
}
