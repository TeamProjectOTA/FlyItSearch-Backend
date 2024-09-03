import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingSave, CreateSaveBookingDto } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authservice: AuthService,

    @InjectRepository(BookingSave)
    private readonly BookingSaveRepository: Repository<BookingSave>,
  ) {}

  async saveBooking(
    createSaveBookingDto: CreateSaveBookingDto,
    header: any,
  ): Promise<any> {
    const email = await this.authservice.decodeToken(header);

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('No Booking data available for the user');
    }
    let saveBooking = await this.BookingSaveRepository.findOne({
      where: { bookingId: createSaveBookingDto.bookingId, user },
    });

    if (saveBooking) {
      saveBooking.bookingStatus = createSaveBookingDto.bookingStatus;
    } else {
      saveBooking = this.BookingSaveRepository.create({
        ...createSaveBookingDto,
        user,
      });
    }
    return await this.BookingSaveRepository.save(saveBooking);
  }
  async cancelDataSave(
    fsid: string,
    status: string,
    header: any,
  ): Promise<any> {
    const email = await this.authservice.decodeToken(header);

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('No Booking data available for the user');
    }
    let saveBooking = await this.BookingSaveRepository.findOne({
      where: { bookingId: fsid, user },
    });
    saveBooking.bookingStatus = status;

    return await this.BookingSaveRepository.save(saveBooking);
  }
}
