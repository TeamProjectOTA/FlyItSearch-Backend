import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BookingSave } from 'src/book/booking.model';
import { BookingIdSave } from 'src/flight/flight.model';
import { Repository } from 'typeorm';

@Injectable()
export class Shedule {
  private readonly username: string = process.env.FLYHUB_UserName;
  private readonly apiKey: string = process.env.FLYHUB_ApiKey;
  private readonly apiUrl: string = process.env.FLyHub_Url;
  private readonly apiUrlbdf: string = process.env.BDFareAPI_URL;
  private readonly apiKeybdf: string = process.env.BDFareAPI_KEY;
  private readonly logger = new Logger(Shedule.name);
  constructor(
    @InjectRepository(BookingSave)
    private readonly bookingRepository: Repository<BookingSave>,
    @InjectRepository(BookingIdSave)
    private readonly bookingIdRepository: Repository<BookingIdSave>,
  ) {}

  @Cron('*/5 * * * *') //  */5: Every 5 minutes*: Every hour*: Every day of the month*: Every month *: Every day of the week
  async scheduling() {
    const bookingSave = await this.bookingRepository.find();

    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000;
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    for (const booking of bookingSave) {
      const timeLeft = new Date(booking.expireDate);
      if (
        dhakaTime.getTime() >= timeLeft.getTime() &&
        booking.bookingStatus === 'Booked'
      ) {
        const userBooking = await this.bookingRepository.findOne({
          where: { bookingId: booking.bookingId },
        });
        if (userBooking.system == 'API1') {
          const cancelData = await this.aircancel(booking.bookingId);
          //this.logger.log("API1 hit ")
          if (cancelData?.BookingStatus) {
            userBooking.bookingStatus = cancelData?.BookingStatus;
          } else {
            userBooking.bookingStatus = 'Cancelled';
          }
        } else if (userBooking.system == 'API2') {
          const cancelData = await this.flightBookingCancel(booking.bookingId);
          //this.logger.log("API2 hit "+cancelData.orderStatus)
          if (cancelData.orderStatus) {
            userBooking.bookingStatus = cancelData?.orderStatus;
          } else {
            userBooking.bookingStatus = 'Cancelled';
          }
        }

        await this.bookingRepository.save(userBooking);
      }
    }
    //this.logger.log('Hitting the sheduling in every 5min ');
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
  async aircancel(BookingID: string): Promise<any> {
    const bookingId = await this.bookingIdRepository.findOne({
      where: { flyitSearchId: BookingID },
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

      return response;
      //return response.data
    } catch (error) {
      throw error?.response?.data;
    }
  }

  async flightBookingCancel(BookingID: string): Promise<any> {
    const bookingId = await this.bookingIdRepository.findOne({
      where: { flyitSearchId: BookingID },
    });
    const orderReference = { orderReference: bookingId.flyhubId };
    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrlbdf}/OrderCancel`,
        orderReference,
        {
          headers: {
            'X-API-KEY': this.apiKeybdf,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.response.orderStatus == 'Cancelled') {
        return response.data.response;
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
