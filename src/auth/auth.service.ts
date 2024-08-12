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
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtservice: JwtService,
  ) {}

  async signInAdmin(uuid: string, pass: string): Promise<any> {
    const admin = await this.adminRepository.findOne({
      where: { uuid: uuid },
    });

    if (!admin || admin.password !== pass) {
      throw new UnauthorizedException('Invalid UUID or password');
    }
    if(admin.status!="ACTIVE"){
      
        throw new ServiceUnavailableException(`Active Your Account ${admin.firstName} ${admin.lastName}`)
      
    }

    const payload = { sub: admin.uuid ,sub2:admin.status};
    const token = await this.jwtservice.signAsync(payload);
    return { access_token: token };
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
      const uuid = decodedToken.sub;

      const adminData = await this.adminRepository.findOne({
        where: { uuid: uuid },
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

  async signInUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare hashed password with user-provided password
    const passwordMatch = await bcrypt.compare(pass, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if(user.emailVerified==false){
      throw new UnauthorizedException('Email is not verified')
    }
    const payload = { sub: user.email, sub2: user.passengerId };
    const token = await this.jwtservice.signAsync(payload);
    return {
      access_token: token,
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

    // if (!decodedToken || !decodedToken.sub2) {
    //   throw new NotFoundException('Invalid token payload');
    // }
    
    return decodedToken.sub;
  }

  async verifyBothToken(header: any): Promise<any> {
    let isUserTokenValid = false;
    let isAdminTokenValid = false;

    try {
      await this.verifyUserToken(header);
      isUserTokenValid = true;
    } catch (error) {
      // console.log(error);
    }

    try {
      await this.verifyAdminToken(header);
      isAdminTokenValid = true;
    } catch (error) {}

    if (!isUserTokenValid && !isAdminTokenValid) {
      throw new UnauthorizedException();
    }
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
      text: `Your varification code : ${token}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email.');
    }
}
  async findByVerificationToken(token: string): Promise<any> {
    
   
    return  this.userRepository.findOne({ where: { verificationToken: token } });
    
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
    return {message:`Thank you ${user.fullName}.Your password has been reseted`}
  }



  async sendPasswordResetEmail(email: string): Promise<any> {
    
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
  
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1800000); // 1 hour expiry
  
    await this.userRepository.save(user);
  
    await this.sendResetPasswordEmail(user.email, resetToken);
    return {message:`Your password reset code has been sent to ${email}`}
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

}
