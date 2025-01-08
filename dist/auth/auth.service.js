"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entity_1 = require("../admin/entities/admin.entity");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const deposit_model_1 = require("../deposit/deposit.model");
const axios_1 = require("axios");
const uploads_model_1 = require("../uploads/uploads.model");
let AuthService = class AuthService {
    constructor(adminRepository, userRepository, jwtservice, profilePictureRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.jwtservice = jwtservice;
        this.profilePictureRepository = profilePictureRepository;
        this.time = 86400;
    }
    async signInAdmin(email, pass) {
        const admin = await this.adminRepository.findOne({
            where: { email: email },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Invalid Email');
        }
        if (admin.password !== pass) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        if (admin.status != 'ACTIVE') {
            throw new common_1.ServiceUnavailableException(`Active Your Account ${admin.firstName} ${admin.lastName}`);
        }
        const payload = { sub: admin.email, sub2: admin.status };
        const token = await this.jwtservice.signAsync(payload);
        const expiresInSeconds = this.time;
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
    async verifyAdminToken(header) {
        try {
            const authHeader = header['authorization'];
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No token provided.');
            }
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new common_1.UnauthorizedException();
            }
            const decodedToken = await this.jwtservice.verifyAsync(token);
            const email = decodedToken.sub;
            const adminData = await this.adminRepository.findOne({
                where: { email: email },
            });
            if (!adminData) {
                throw new common_1.UnauthorizedException('Admin not found.');
            }
            return adminData;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            else {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
    }
    async signInUser(email, pass, isGoogleAuth = false) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email');
        }
        if (!isGoogleAuth) {
            const passwordMatch = await bcrypt.compare(pass, user.password);
            if (!passwordMatch) {
                throw new common_1.UnauthorizedException('Invalid password');
            }
        }
        if (!isGoogleAuth && user.emailVerified === false) {
            throw new common_1.UnauthorizedException('Email is not verified');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.ServiceUnavailableException(`Mr : ${user.fullName}, due to some of your activity we decided to inactivate your account. Please contact our support for the process to activate your account.`);
        }
        const payload = { sub: user.email, sub2: user.fullName };
        const expiresInSeconds = this.time;
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
    async verifyUserToken(header) {
        try {
            const authHeader = header['authorization'];
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No token provided.');
            }
            const token = authHeader.replace('Bearer ', '');
            const decodedToken = await this.jwtservice.verifyAsync(token);
            const email = decodedToken.sub;
            const userData = await this.userRepository.findOne({
                where: { email: email },
            });
            if (!userData) {
                throw new common_1.UnauthorizedException('User not found.');
            }
            return userData;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            else {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
    }
    async getUserByEmail(email) {
        return this.userRepository.findOne({ where: { email: email } });
    }
    async getAdminByUUID(uuid) {
        return this.adminRepository.findOne({ where: { uuid: uuid } });
    }
    async decodeToken(header) {
        if (!header || !header.authorization) {
            throw new common_1.NotFoundException('Authorization header not found');
        }
        const token = header.authorization.replace('Bearer ', '');
        let decodedToken;
        try {
            decodedToken = await this.jwtservice.verifyAsync(token);
        }
        catch (error) {
            throw new common_1.NotFoundException('Invalid token');
        }
        return decodedToken.sub;
    }
    async sendVerificationEmail(email, token) {
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
        }
        catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email.');
        }
    }
    async findByVerificationToken(token) {
        return this.userRepository.findOne({ where: { verificationToken: token } });
    }
    async resetPassword(resetToken, newPassword) {
        const currentTime = new Date();
        const user = await this.userRepository.findOne({
            where: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: (0, typeorm_2.MoreThan)(currentTime),
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired reset token.');
        }
        if (!newPassword || newPassword.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters long.');
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
    async sendPasswordResetEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!email) {
            throw new common_1.NotFoundException('Please Enter Your Email');
        }
        if (user.googleId) {
            throw new common_1.ConflictException('This email is associated with a Google login. Password reset is not allowed.');
        }
        if (!user) {
            throw new common_1.NotFoundException('There is no User Associated with this email');
        }
        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - 3600000);
        if (user.resetAttemptTimestamp &&
            user.resetAttemptTimestamp > oneHourAgo &&
            user.resetAttemptCount >= 3) {
            throw new common_1.BadRequestException({
                message: 'You have exceeded the maximum number of reset attempts in the past hour. Please try again later.',
                statusCode: 429,
                error: 'Too Many Reset Attempts',
            });
        }
        if (!user.resetAttemptTimestamp ||
            user.resetAttemptTimestamp <= oneHourAgo) {
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
    async sendResetPasswordEmail(email, token) {
        const mailOptions = {
            from: `"FlyitSearch Support" <${process.env.EMAIL_OTP}>`,
            to: email,
            subject: 'Reset Your Password - FlyitSearch',
            text: `
    Hi,
    
    We received a request to reset your password. Please use the link below to reset it:
    https://www.flyitsearch.com/resetpassword?token=${token}
    
    If you didn’t request this, you can safely ignore this email.
    
    Best regards,  
    FlyitSearch Team
      `,
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
          ">Reset Your Password</h2>
          <p style="
            margin-bottom: 10px; 
            font-size: 14px;
            line-height: 1.6;
          ">
            Hi,
          </p>
          <p style="
            margin-bottom: 20px; 
            font-size: 14px; 
            line-height: 1.6;
          ">
            We received a request to reset your password. Click the button below to securely reset it. If you didn’t request this, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 10px 0;">
            <a href="https://www.flyitsearch.com/resetpassword?token=${token}" style="
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              font-weight: bold;
              color: #fff;
              background-color: #13406b;
              text-decoration: none;
              border-radius: 6px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            " rel="noopener noreferrer">
              Reset Password
            </a>
          </div>
          <p style="
            margin-top: 30px; 
            font-size: 12px; 
            color: #666;
            line-height: 1.6;
          ">
            Alternatively, copy and paste this link into your browser:
            <br>
            <a href="https://www.flyitsearch.com/resetpassword?token=${token}" style="color: #13406b; text-decoration: none;">
              https://www.flyitsearch.com/resetpassword?token=${token}
            </a>
          </p>
          <p style="
            margin-top: 30px; 
            font-size: 14px; 
            line-height: 1.6;
          ">
            Best regards,<br>
            <strong style="color: #13406b;">FlyitSearch Team</strong>
          </p>
        </div>
      `,
        };
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            await transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send reset password email.');
        }
    }
    async signInUserForGoogle(user) {
        if (user.status !== 'ACTIVE') {
            throw new common_1.ServiceUnavailableException(`Mr : ${user.fullName}, due to some of your activity we decided to Inactivate your account. Please contact our support for the process to activate your account.`);
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
    async validateUser(user) {
        const { email, fullName, googleId, picture } = user;
        let existingUser = await this.userRepository.findOne({ where: { email } });
        if (!existingUser) {
            const passenger = await this.userRepository.find({
                order: { id: 'DESC' },
                take: 1,
            });
            let passengerId;
            if (passenger.length === 1) {
                const lastPassenger = passenger[0];
                const oldpassengerId = lastPassenger.passengerId.replace('FLYITP', '');
                passengerId = 'FLYITP' + (parseInt(oldpassengerId) + 1);
            }
            else {
                passengerId = 'FLYITP1000';
            }
            let newUser = new user_entity_1.User();
            newUser.passengerId = passengerId;
            newUser.password = 'Google log in';
            newUser.email = email;
            newUser.fullName = fullName.toUpperCase();
            newUser.googleId = googleId;
            newUser.status = 'ACTIVE';
            newUser.emailVerified = true;
            newUser.role = 'registered';
            const newWallet = new deposit_model_1.Wallet();
            newWallet.ammount = 0;
            newUser.wallet = newWallet;
            existingUser = await this.userRepository.save(newUser);
            const profilePicture = new uploads_model_1.ProfilePicture();
            profilePicture.user = existingUser;
            profilePicture.filename = 'fromGoogle';
            profilePicture.link = picture;
            profilePicture.size = 55;
            await this.profilePictureRepository.save(profilePicture);
        }
        return await this.signInUserForGoogle(existingUser);
    }
    async emailVerified(email) {
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
        }
        catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email.');
        }
    }
    async verifyGoogleToken(token) {
        try {
            const googleResponse = await axios_1.default.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            const user = {
                email: googleResponse.data.email,
                fullName: googleResponse.data.name,
                googleId: googleResponse.data.sub,
                picture: googleResponse.data.picture,
            };
            const jwtToken = await this.validateUser(user);
            return jwtToken;
        }
        catch (error) {
            console.error('Error verifying Google token:', error);
            throw new common_1.HttpException('Authentication failed', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(uploads_model_1.ProfilePicture)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map