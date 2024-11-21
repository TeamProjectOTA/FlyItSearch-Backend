import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { Wallet } from 'src/deposit/deposit.model';

@Injectable()
export class AuthService {
  authservice: any;
  private readonly time: number;
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtservice: JwtService,
  ) {
    //86400
    this.time = 86400;
  }

  async signInAdmin(email: string, pass: string): Promise<any> {
    const admin = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (!admin) {
      throw new NotFoundException('Invalid Email');
    }

    if (admin.password !== pass) {
      throw new UnauthorizedException('Invalid password');
    }
    if (admin.status != 'ACTIVE') {
      throw new ServiceUnavailableException(
        `Active Your Account ${admin.firstName} ${admin.lastName}`,
      );
    }

    const payload = { sub: admin.email, sub2: admin.status };
    const token = await this.jwtservice.signAsync(payload);
    const expiresInSeconds = this.time; // !important change it according to time out limit.
    const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

    const dhakaOffset = 6 * 60 * 60 * 1000;
    const dhakaTime = new Date(expirationDate.getTime() + dhakaOffset);

    const dhakaTimeFormatted = dhakaTime.toISOString();
    const adminData = {
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      phone: admin.phone,
      uuid: admin.uuid,
    };
    return {
      access_token: token,
      message: 'Log In Successfull',
      adminData,
      expireIn: dhakaTimeFormatted,
    };
  }

  async verifyAdminToken(header: any) {
    try {
      const authHeader = header['authorization'];
      if (!authHeader) {
        throw new UnauthorizedException('No token provided.');
      }
      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException();
      }

      const decodedToken = await this.jwtservice.verifyAsync(token);
      const email = decodedToken.sub;

      const adminData = await this.adminRepository.findOne({
        where: { email: email },
      });

      if (!adminData) {
        throw new UnauthorizedException('Admin not found.');
      }

      return adminData;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  async signInUser(
    email: string,
    pass?: string,
    isGoogleAuth: boolean = false,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (!isGoogleAuth) {
      const passwordMatch = await bcrypt.compare(pass, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    if (!isGoogleAuth && user.emailVerified === false) {
      throw new UnauthorizedException('Email is not verified');
    }

    if (user.status !== 'ACTIVE') {
      throw new ServiceUnavailableException(
        `Mr : ${user.fullName}, due to some of your activity we decided to inactivate your account. Please contact our support for the process to activate your account.`,
      );
    }

    const payload = { sub: user.email, sub2: user.fullName };
    const expiresInSeconds = this.time; // Adjust expiration as needed
    const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

    const token = await this.jwtservice.signAsync(payload);

    const userData = {
      name: user.fullName,
      email: user.email,
      phone: user.phone,
    };

    return {
      access_token: token,
      message: 'Log In Successful',
      userData,
      expireIn: expirationDate,
    };
  }

  async verifyUserToken(header: any) {
    try {
      const authHeader = header['authorization'];
      if (!authHeader) {
        throw new UnauthorizedException('No token provided.');
      }
      const token = authHeader.replace('Bearer ', '');

      const decodedToken = await this.jwtservice.verifyAsync(token);

      const email = decodedToken.sub;

      const userData = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!userData) {
        throw new UnauthorizedException('User not found.');
      }

      return userData;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async getAdminByUUID(uuid: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { uuid: uuid } });
  }

  async decodeToken(header: any): Promise<string> {
    if (!header || !header.authorization) {
      throw new NotFoundException('Authorization header not found');
    }

    const token = header.authorization.replace('Bearer ', '');

    let decodedToken: any;
    try {
      decodedToken = await this.jwtservice.verifyAsync(token);
    } catch (error) {
      throw new NotFoundException('Invalid token');
    }

    return decodedToken.sub;
  }
  async sendVerificationEmail(email: string, token: string): Promise<void> {
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
      subject: 'Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <div style="padding: 20px; position: relative;">
            <div style="color: #13406b; margin-bottom: 20px;">
            <h3>Flyit-Search</h3>
            <h4>Email Verification</h4>
            </div>
            <p style="font-size: 16px;">Dear Traveler,</p>
            <p style="font-size: 16px;">Your One Time Password (OTP) for email verification is:</p>
            <div style="text-align: center; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
              <p style="font-size: 28px; font-weight: bold; color: #13406b; margin: 10px 0;">${token}</p>
            </div>
            <p style="font-size: 16px;">This OTP is valid for the next <strong>299 seconds</strong>. Please verify your email by submitting this OTP code.</p>
            <p style="font-size: 16px;">If you face any issues during verification, please contact our 24-hour Call Center:</p>
            <div style="display: flex; align-items: center; margin-top: 20px;">
              <a href="tel:+8801736987906" style="text-decoration: none;">
                <img src="https://storage.googleapis.com/flyit-search-test-bucket/WebsiteImage/phone_icon-removebg-preview%20(1).png" 
                     alt="Call Icon" style="width: 150px; height: 49px;">
              </a>
            </div>
          </div>
          <div style="padding: 10px; text-align: center; font-size: 12px; color: #ff0505;">
            <p style="margin: 0;"><strong>*Please do not share your OTP with anyone. If this email was not intended for you, please ignore it.</strong></p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email.');
    }
  }
  async findByVerificationToken(token: string): Promise<any> {
    return this.userRepository.findOne({ where: { verificationToken: token } });
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<any> {
    const currentTime = new Date();

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: MoreThan(currentTime),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.',
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);
    return {
      message: `Thank you ${user.fullName}. Your password has been successfully reset.`,
      statusCode: 200,
    };
  }

  async sendPasswordResetEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!email) {
      throw new NotFoundException('Please Enter Your Email');
    }
    if (!user) {
      throw new NotFoundException(
        'There is no User Associated with this email',
      );
    }
    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 3600000);

    if (
      user.resetAttemptTimestamp &&
      user.resetAttemptTimestamp > oneHourAgo &&
      user.resetAttemptCount >= 3
    ) {
      throw new BadRequestException({
        message:
          'You have exceeded the maximum number of reset attempts in the past hour. Please try again later.',
        statusCode: 429,
        error: 'Too Many Reset Attempts',
      });
    }

    if (
      !user.resetAttemptTimestamp ||
      user.resetAttemptTimestamp <= oneHourAgo
    ) {
      user.resetAttemptTimestamp = currentTime;
      user.resetAttemptCount = 0;
    }
    user.resetAttemptCount += 1;
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(currentTime.getTime() + 3600000);

    await this.userRepository.save(user);

    await this.sendResetPasswordEmail(user.email, resetToken);
    return { message: `Your password reset link has been sent to ${email}` };
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_OTP,
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background-color: #f9f9f9;
          color: #333;
          line-height: 1.6;
        ">
          <h2 style="
            color: #13406b; 
            text-align: center; 
            margin-bottom: 20px;
          ">Password Reset Request</h2>
          <p style="margin:  0 0 10px; font-size: 13px">Hi,</p>
          <div style="margin: 0 0 20px; font-size: 13px">
            We received a request to reset your password. Please click the button below to reset your password.If you didn’t request this, you can safely ignore this email.</div>
          <div style="text-align: center; margin: 10px 0;">
            <a href="http://192.168.10.30:3000/resetpassword?token=${token}" style="
              display: inline-block;
              padding: 9px 17px;
              font-size: 15px;
              font-weight: bold;
              color: #fff;
              background-color: #13406b;
              text-decoration: none;
              border-radius: 6px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            ">
              Reset Password
            </a>
          </div>
          <p style="margin: 50px 0 0 0; font-size:14px">Best regards,</p>
          <p style="margin: 0;font-size:14px; color: #13406b;"><strong>FlyitSearch Team</strong></p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email.');
    }
  }

  async signInUserForGoogle(user: User): Promise<any> {
    if (user.status !== 'ACTIVE') {
      throw new ServiceUnavailableException(
        `Mr : ${user.fullName}, due to some of your activity we decided to Inactivate your account. Please contact our support for the process to activate your account.`,
      );
    }

    const payload = { sub: user.email, sub2: user.passengerId };
    const expiresInSeconds = this.time;
    const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

    const dhakaOffset = 6 * 60 * 60 * 1000;
    const dhakaTime = new Date(expirationDate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();

    const token = await this.jwtservice.signAsync(payload);
    const userData = {
      name: user.fullName,
      email: user.email,
      phone: user.phone,
    };

    return {
      access_token: token,
      message: 'Log In Successful',
      userData,
      expireIn: dhakaTimeFormatted,
    };
  }

  async validateUser(user: any): Promise<any> {
    const { email, fullName, googleId } = user;
    let existingUser = await this.userRepository.findOne({ where: { email } });

    if (!existingUser) {
      const passenger = await this.userRepository.find({
        order: { id: 'DESC' },
        take: 1,
      });
      let passengerId: string;
      if (passenger.length === 1) {
        const lastPassenger = passenger[0];
        const oldpassengerId = lastPassenger.passengerId.replace('FLYITP', '');
        passengerId = 'FLYITP' + (parseInt(oldpassengerId) + 1);
      } else {
        passengerId = 'FLYITP1000';
      }

      let newUser = new User();
      newUser.passengerId = passengerId;
      newUser.password = 'Google loge in';
      newUser.email = email;
      newUser.fullName = fullName.toUpperCase();
      newUser.googleId = googleId;
      newUser.status = 'ACTIVE';
      newUser.emailVerified = true;
      newUser.role = 'registered';
      const newWallet = new Wallet();
      newWallet.ammount = 0;
      newUser.wallet = newWallet;

      existingUser = await this.userRepository.save(newUser);
    }
    return await this.signInUserForGoogle(existingUser);
  }
  async emailVerified(email: string): Promise<void> {
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
      subject: 'Email Verified',
      html: `<h1>Email Verification Completed</h1>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email.');
    }
  }
}
