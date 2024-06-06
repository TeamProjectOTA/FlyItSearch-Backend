import { Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Header } from './header.model';

@Module({
  imports: [TypeOrmModule.forFeature([Header])],
  controllers: [HomepageController],
  providers: [HomepageService],
})
export class HomepageModule {}
