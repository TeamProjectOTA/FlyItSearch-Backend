import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './book.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlightModule } from 'src/flight/flight.module';
import { Admin } from 'src/admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File,Admin]), FlightModule],
  controllers: [BookController],
  providers: [BookService, FlyHubService],
})
export class BookModule {}
