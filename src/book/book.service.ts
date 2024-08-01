import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaveBookingDto, File, SaveBooking } from './book.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(SaveBooking)
    private saveBookingRepository: Repository<SaveBooking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authservice: AuthService,
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
  
  async saveBooking(
    createSaveBookingDto: CreateSaveBookingDto,
    header: any,
  ): Promise<SaveBooking> {
    const email = await this.authservice.decodeToken(header);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('No Booking data available for the user');
    }

    const saveBooking = this.saveBookingRepository.create({
      ...createSaveBookingDto,
      user,
    });

    return this.saveBookingRepository.save(saveBooking);
  }
}
