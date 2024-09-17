import {
  BadRequestException,
  Injectable,
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

    const payload = { sub: user.email, sub2: user.passengerId };
    const expiresInSeconds = this.time; // Adjust expiration as needed
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

  //  for ratelimiter
  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }
  //for ratelimiter
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
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_CC,
      to: email,
      subject: 'Email Verification',
      html: `<h1>Your varification code :<strong> ${token}</strong></h1>`,
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
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);
    return {
      message: `Thank you ${user.fullName}.Your password has been reseted`,
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

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1800000); // 1 hour expiry

    await this.userRepository.save(user);

    await this.sendResetPasswordEmail(user.email, resetToken);
    return { message: `Your password reset code has been sent to ${email}` };
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_CC,
      to: email,
      subject: 'Password Verification',
      text: `Your varification code : ${token}`,
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
    const expiresInSeconds = this.time; // Adjust expiration as needed
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
      newUser.email = email;
      newUser.fullName = fullName.toUpperCase();
      newUser.googleId = googleId;
      newUser.status = 'ACTIVE';
      newUser.emailVerified = true;
      newUser.role = 'registered';

      existingUser = await this.userRepository.save(newUser);

      return existingUser;
    }
    //console.log(existingUser);
    return await this.signInUserForGoogle(existingUser);
  }
}
