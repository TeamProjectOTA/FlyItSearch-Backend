import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  BookingSave, CreateSaveBookingDto } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

import { BookingIdSave } from 'src/flight/flight.model';


@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authservice: AuthService,
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(BookingIdSave)
    private readonly bookingIdSave: Repository<BookingIdSave>,
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
    let saveBooking = await this.bookingSaveRepository.findOne({
      where: { bookingId: createSaveBookingDto.bookingId, user },
    });

    if (saveBooking) {
      saveBooking.bookingStatus = createSaveBookingDto.bookingStatus;
    } else {
      saveBooking = this.bookingSaveRepository.create({
        ...createSaveBookingDto,
        user,
      });
    }
    return await this.bookingSaveRepository.save(saveBooking);
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
    let saveBooking = await this.bookingSaveRepository.findOne({
      where: { bookingId: fsid, user },
    });
    saveBooking.bookingStatus = status;
    saveBooking.actionBy = user.fullName;
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    saveBooking.actionAt = dhakaTimeFormatted;

    return await this.bookingSaveRepository.save(saveBooking);
  }

  async findAllBooking(bookingStatus?: string) {
    if (bookingStatus !== 'all') {
      return await this.bookingSaveRepository.find({
        where: { bookingStatus: bookingStatus },
        relations: ['user'],
        order: { bookingDate: 'DESC' },
      });
    } else {
      return await this.bookingSaveRepository.find({
        relations: ['user'],
        order: { bookingDate: 'DESC' },
      });
    }
  }
  async findUserWithBookings(header: any, bookingStatus: string): Promise<any> {
    const verifyUser = await this.authservice.verifyUserToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }
    const email = await this.authservice.decodeToken(header);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bookingSave', 'bookingSave')
      .where('user.email = :email', { email })
      .andWhere('LOWER(bookingSave.bookingStatus) = LOWER(:bookingStatus)', {
        bookingStatus,
      })
      .orderBy('bookingSave.id', 'DESC')
      .getOne();

    if (!user) {
      throw new NotFoundException(`No ${bookingStatus} Available for the user`);
    }

    return {
      saveBookings: user.bookingSave,
    };
  }
}
