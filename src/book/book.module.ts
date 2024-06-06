import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './book.model';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
