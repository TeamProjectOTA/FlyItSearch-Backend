import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly authService:AuthService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Register Handlebars helpers
    handlebars.registerHelper('formatTime', function (datetime) {
      return new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    handlebars.registerHelper('formatDate', function (datetime) {
      return new Date(datetime).toLocaleDateString();
    });

    handlebars.registerHelper('formatDuration', function (duration) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    });
  }

  private async compileTemplate(templateName: string, data: any): Promise<string> {
    const filePath = path.join(process.cwd(), 'src', 'mail', `${templateName}.hbs`);
    const template = fs.readFileSync(filePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
}

  async sendMail(data: any,header:any) {
    const email=await this.authService.decodeToken(header)
    const html = await this.compileTemplate('booking', {
      BookingStatus:data.BookingStatus === "Booked" ? "Confirmed" : data.BookingStatus === "Cancelled" ? "Cancellation" : "",
      BookingId: data.BookingId,
      CarrierName: data.CarrierName,
      NetFare: data.NetFare,
      AllLegsInfo: data.AllLegsInfo,
      PassengerList: data.PassengerList,
      flightUrl: 'https://flyitsearch.netlify.app/', // or dynamically generated URL
    });

    const mailOptions = {
      from: process.env.EMAIL_CC,
      to: email,
      subject: `Flight ${data.BookingStatus} confirmation`,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }
}
