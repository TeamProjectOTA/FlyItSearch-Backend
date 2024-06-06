import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Header, HeaderDto } from './header.model';
import { In, Repository } from 'typeorm';

@Injectable()
export class HomepageService {
  private counter = 0;
  constructor(
    @InjectRepository(Header)
    private readonly headerRepository: Repository<Header>,
  ) {}

  async saveFiles(files: Express.Multer.File[]): Promise<Header[]> {
    try {
      const newFiles = files.map((file) => {
        this.counter += 1;
        const filename = `SliderImage-${this.counter}`;
        return this.headerRepository.create({
          filename: filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        });
      });

      return this.headerRepository.save(newFiles);
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async getFileById(id: number): Promise<Header> {
    const file = await this.headerRepository.findOne({ where: { id: id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }
  async findMultiple(ids: number[]) {
    const headers = await this.headerRepository.findBy({ id: In(ids) });
    const partialHeader = headers.map((header) => ({
      id: header.id,
      name: header.filename,
      path: header.path,
    }));

    if (headers.length === 0) {
      throw new NotFoundException(`No headers found for the given IDs`);
    }
    return partialHeader;
  }
}
