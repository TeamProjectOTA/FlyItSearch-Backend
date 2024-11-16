import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingID, BookingSave, CreateSaveBookingDto } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BookingIdSave } from 'src/flight/flight.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';

@Injectable()
export class BookingService {
  private readonly username: string = process.env.FLYHUB_UserName;
  private readonly apiKey: string = process.env.FLYHUB_ApiKey;
  private readonly apiUrl: string = process.env.FLyHub_Url;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authservice: AuthService,
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(BookingIdSave)
    private readonly bookingIdSave:Repository<BookingIdSave>,
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
    const userUpdate = await this.userRepository.findOne({
      where: { email: email },
      relations: ['bookingSave'],
    });
    if (!userUpdate) {
      throw new NotFoundException('User not found');
    }
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000;
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    for (const booking of userUpdate.bookingSave) {
      const timeLeft = new Date(booking.expireDate);
      if (
        dhakaTime.getTime() >= timeLeft.getTime() &&
        booking.bookingStatus === 'Booked'
      ) {
        const userBooking = await this.bookingSaveRepository.findOne({
          where: { bookingId: booking.bookingId },
        });
        const cancelData= await this.aircancel(booking.bookingId)
        if(cancelData?.BookingStatus){
        userBooking.bookingStatus = cancelData?.BookingStatus;}
        else{
          userBooking.bookingStatus='Cancelled'
        }
        await this.bookingSaveRepository.save(userBooking);
      }
    }
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

  

  async getToken(): Promise<string> {
    try {
      const config: AxiosRequestConfig = {
        method: 'post',
        url: `${this.apiUrl}/Authenticate`,
        data: {
          username: this.username,
          apiKey: this.apiKey,
        },
      };

      const response: AxiosResponse<any> = await axios.request(config);

      const token: string = response?.data?.TokenId;
      if (!token) {
        throw new HttpException(
          'Token not found in response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      // console.log(token);
      return token;
    } catch (error) {
      console.error(
        'Error fetching token:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to authenticate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
  }
   async aircancel(BookingID:string): Promise<any> {
    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID},
    });
    const flyhubId = bookingId.flyhubId;
    const token = await this.getToken();
    const ticketCancel = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirCancel`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { BookingID: flyhubId },
    };
    try {
      const response = await axios.request(ticketCancel);

      return response
      //return response.data
    } catch (error) {
      throw error?.response?.data;
    }
  }
}
