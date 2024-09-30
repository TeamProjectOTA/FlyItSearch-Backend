import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Transection } from 'src/transection/transection.model';
import { IpModule } from 'src/ip/ip.module';
import { IpAddress } from 'src/ip/ip.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transection, IpAddress]),
    AuthModule,
    IpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
