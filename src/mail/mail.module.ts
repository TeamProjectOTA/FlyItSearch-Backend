import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Admin]),
    AuthModule,
    AdminModule,
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
