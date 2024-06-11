import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtservice: JwtService,
  ) {}

  async signInAdmin(
    uuid: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const admin = await this.adminRepository.findOne({
      where: { uuid: uuid },
    });

    if (!admin || admin.password !== pass) {
      throw new UnauthorizedException('Invalid UUID or password');
    }

    const payload = { sub: admin.uuid };
    // const sanitizedAdmin: Partial<Admin> = {
    //   firstName: admin.firstName,
    //   lastName: admin.lastName,
    //   email: admin.email,
    // };
    return { access_token: await this.jwtservice.signAsync(payload) };
  }

  async verifyAdminToken(header: any) {
    try {
      const token = header['authorization'].replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException();
      }

      const decodedToken = await this.jwtservice.verifyAsync(token);
      const uuid = decodedToken.sub;

      const adminData = await this.adminRepository.findOne({
        where: { uuid: uuid },
      });

      if (!adminData) {
        throw new UnauthorizedException();
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
    pass: string,
  ): Promise<{ access_token: string }> {
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

    const payload = { sub: user.email };
    const sanitizedUser: Partial<User> = {
      fullName: user.fullName,
      phone: user.phone,
    };
    return {
      access_token: await this.jwtservice.signAsync(payload),
    };
  }
  async verifyUserToken(header: any) {
    try {
      const token = header['authorization'].replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException();
      }
      const decodedToken = await this.jwtservice.verifyAsync(token);
      const email = decodedToken.sub;
      const userData = this.userRepository.findOne({
        where: { email: email },
      });

      if (!userData) {
        throw new UnauthorizedException();
      }

      return await userData;
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
    return this.userRepository.findOne({ where: { email:email } });
  }
    //for ratelimiter
    async getAdminByUUID(uuid: string): Promise<Admin> {
      return this.adminRepository.findOne({ where: { uuid:uuid } });
    }
  
}
