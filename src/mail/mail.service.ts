import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendEmaildto } from './mail.interface';
import Mail from 'nodemailer/lib/mailer';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}
  MailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('EMAIL_HOST'),
      port: this.config.get<number>('EMAIL_PORT'),
      secure: false, // Use `true` for port 465, `false` for all other ports, true will get an error.have to fix it, nothing to change
      auth: {
        user: this.config.get<string>('EMAIL_USERNAME'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
    });
    return transporter;
  }
  async sendMail(maildto: sendEmaildto, header: any) {
    const verifyAdmin = await this.authService.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    const { from, recipeants, subject, html } = maildto;
    const transport = this.MailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: this.config.get<string>('EMAIL_CC'),
        address: this.config.get<string>('APP_NAME'),
      },
      to: recipeants,
      subject,
      html,
    };
    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      console.log('Error: ', error);
    }
  }
}
