import { Controller, Post, Body, Headers, Get, Query } from '@nestjs/common';
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

  @Get('cancel')
  async sendCancellationEmail(
    @Query('bookingId') bookingId: string,
    @Query('status') status: string,
    @Query('email') email: string,
  ) 
  {
      await this.mailerService.cancelMail(bookingId, status, email);
      return {
        success: true,
        message: `Cancellation email sent successfully to ${email}.`,
      };
    
  }
}
