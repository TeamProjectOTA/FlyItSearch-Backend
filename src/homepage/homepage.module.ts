import { Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomePage } from './homepage.model';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([HomePage]),AuthModule],
  controllers: [HomepageController],
  providers: [HomepageService],
})
export class HomepageModule {}
