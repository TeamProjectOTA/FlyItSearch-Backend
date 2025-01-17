import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constaints';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Transection } from 'src/transection/transection.model';
import { IpAddress } from 'src/ip/ip.model';
import { ProfilePicture } from 'src/uploads/uploads.model';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      User,
      Transection,
      IpAddress,
      ProfilePicture,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' }, //changed hare for expired time changed
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
