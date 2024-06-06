import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './book.model';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<File> {
    try {
      const newFile = this.fileRepository.create({
        filename: 'FLYT' + file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      });
      return this.fileRepository.save(newFile);
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }
}
