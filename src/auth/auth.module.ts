import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constaints';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
