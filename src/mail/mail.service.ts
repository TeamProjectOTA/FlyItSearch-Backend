import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
  private transporter: any;

  constructor(private readonly authService: AuthService) {
    this.transporter = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    handlebars.registerHelper('formatTime', function (datetime) {
      return new Date(datetime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
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

  private async compileTemplate(
    templateName: string,
    data: any,
  ): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      'src',
      'mail',
      `${templateName}.hbs`,
    );
    const template = fs.readFileSync(filePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }

  async sendMail(data: any, header?: any) {
    //email
    //const name = this.authService.decodeToken(header);
    const bodyData = {
      BookingID: data.BookingId,
    };
    const html = await this.compileTemplate('booking', {
      BookingStatus:
        data.BookingStatus === 'Booked'
          ? 'Confirmed'
          : data.BookingStatus === 'Cancelled'
            ? 'Cancellation'
            : '',
      BookingId: data.BookingId,
      CarrierName: data.CarrierName,
      NetFare: data.NetFare,
      AllLegsInfo: data.AllLegsInfo,
      PassengerList: data.PassengerList,
      bodyData: bodyData,
    });
    const email = data?.PassengerList[0]?.Email;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Flight ${data.BookingStatus} confirmation`,
      html,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { message: 'The email was delivered', info };
    } catch (error) {
      throw error;
    }
  }
  async cancelMail(bookingId: string, status: string, email: string,) {
    const transporter = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_OTP,
      to: email,
      subject: 'Flyit-Search: Booking Cancellation Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <div style="color: #13406b; margin-bottom: 20px; text-align: center;">
              <h3 style="margin: 0;">Flyit-Search</h3>
              <h4 style="margin: 0;">Booking Cancellation Confirmation</h4>
            </div>
            <p style="font-size: 16px; margin: 10px 0;">Dear Traveler,</p>
            <p style="font-size: 16px; margin: 10px 0;">
              We regret to inform you that your booking has been <strong>cancelled</strong>.
            </p>
            <div style="text-align: center; background-color: #e6e6e6; padding: 15px; border-radius: 8px; margin: 20px auto; width: 70%;">
              <p style="font-size: 24px; font-weight: bold; color: #13406b; margin: 0;">Booking ID: ${bookingId}</p>
            </div>
            <p style="font-size: 16px; margin: 10px 0;">Status: <strong>${status}</strong></p>
            <p style="font-size: 16px; margin: 10px 0;">
              If you have any questions or need assistance, please don't hesitate to contact our 24-hour Call Center:
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="tel:+8801736987906" style="text-decoration: none;">
                <img src="https://storage.googleapis.com/flyit-search-test-bucket/WebsiteImage/phone_icon-removebg-preview%20(1).png" 
                     alt="Call Icon" style="width: 150px; height: 49px;">
              </a>
            </div>
            <p style="font-size: 16px; margin: 10px 0;">
              We apologize for any inconvenience caused and thank you for choosing Flyit-Search.
            </p>
            <p style="margin: 0;text-align: center; font-size: 12px; color: #ff0505;"><strong>*If you did not request this cancellation, please contact us immediately.</strong></p>
          </div>
        </div>
      `,
    };
    
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      throw new Error('Failed to send cancellation email.');
    }
  }
  
  
}
