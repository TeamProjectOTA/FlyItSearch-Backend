import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FlyHubUtil } from './flyhub.util';
import { plainToClass } from 'class-transformer';
import {
  FlbFlightSearchDto,
  FlyAirSearchDto,
  searchResultDto,
} from './Dto/flyhub.model';
import { BookingIdSave, FlightSearchModel } from '../flight.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingID, BookingSave } from 'src/book/booking.model';

@Injectable()
export class FlyHubService {
  private readonly username: string = process.env.FLYHUB_UserName;
  private readonly apiKey: string = process.env.FLYHUB_ApiKey;
  private readonly apiUrl: string = process.env.FLyHub_Url;

  constructor(
    private readonly flyHubUtil: FlyHubUtil,
    @InjectRepository(BookingIdSave)
    private readonly bookingIdSave: Repository<BookingIdSave>,
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
  ) {}

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

  async searchFlights(reqBody: FlyAirSearchDto): Promise<any> {
    const token = await this.getToken();
    const shoppingrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirSearch`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: reqBody,
    };

    try {
      const response = await axios.request(shoppingrequest);

      return await this.flyHubUtil.restBFMParser(
        response.data,
        reqBody.JourneyType,
      );
      // return response.data
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async aircancel(BookingID: BookingID, header: any): Promise<any> {
    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID.BookingID },
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

      return this.flyHubUtil.bookingCancelDataTranformerFlyhub(
        response.data,
        BookingID.BookingID,
        header,
      );
      //return response.data
    } catch (error) {
      throw error?.response?.data;
    }
  }
  async airRetrive(BookingID: BookingID, header?: any): Promise<any> {
    const findBooking = await this.bookingSaveRepository.findOne({
      where: { bookingId: BookingID.BookingID },
      relations: ['user'],
    });
    if (findBooking.bookingData[0].GDSPNR) {
      return { bookingData: findBooking.bookingData };
    }
    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID.BookingID },
    });
    if (!bookingId) {
      throw new NotFoundException(
        `No Booking Found with ${BookingID.BookingID}`,
      );
    }

    const flyhubId = bookingId.flyhubId;
    const token = await this.getToken();
    const ticketRetrive = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirRetrieve`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { BookingID: flyhubId },
    };

    try {
      const response = await axios.request(ticketRetrive);
      //return response.data
      return this.flyHubUtil.airRetriveDataTransformer(
        response?.data,
        BookingID.BookingID,
        findBooking.bookingStatus,
        findBooking.TripType,
        findBooking.bookingDate,
        header,
      );
    } catch (error) {
      throw error?.response?.data;
    }
  }
  async bookingRules(data: searchResultDto) {
    const token = await this.getToken();
    const ticketCancel = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirMiniRules`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(ticketCancel);
      return response.data;
    } catch (error) {
      throw error?.response?.data;
    }
  }

  async airPrice(data: searchResultDto) {
    const token = await this.getToken();
    const Price = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirPrice`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(Price);
      if (response.data.Results[0].HoldAllowed === false) {
        throw new ForbiddenException(
          'Sorry, you cannot book this ticket. Contact our help line for more updates',
        );
      }
      return this.flyHubUtil.restBFMParser(response.data);
    } catch (error) {
      throw error;
    }
  }
  async airRules(data: searchResultDto) {
    const token = await this.getToken();
    const seeRules = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirRules`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    try {
      const response = await axios.request(seeRules);
      return response.data;
    } catch (error) {
      throw error?.response?.data;
    }
  }

  async airbook(
    data: FlbFlightSearchDto,
    header: any,
    currentTimestamp: any,
    personIds: any,
  ) {
    const token = await this.getToken();

    const Price = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirPrice`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    const PreBookticket = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirPreBook`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    const Bookticket = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirBook`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    try {
      const response0 = await axios.request(Price);
      if (response0.data.Results[0].HoldAllowed === false) {
        throw new ForbiddenException(
          'Sorry, you cannot book this ticket. Contact our help line for more updates',
        );
      } else {
        const response1 = await axios.request(PreBookticket);
        const response = await axios.request(Bookticket);

        return await this.flyHubUtil.bookingDataTransformerFlyhb(
          response.data,
          header,
          currentTimestamp,
          personIds,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async airRetriveAdmin(BookingID: BookingID): Promise<any> {
    const findBooking = await this.bookingSaveRepository.findOne({
      where: { bookingId: BookingID.BookingID },
      relations: ['user'],
    });
    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID.BookingID },
    });
    if (findBooking.bookingData[0].GDSPNR) {
      return findBooking.bookingData;
    }

    if (!bookingId) {
      throw new NotFoundException(
        `No Booking Found with ${BookingID.BookingID}`,
      );
    }

    const flyhubId = bookingId.flyhubId;
    const token = await this.getToken();
    const ticketRetrive = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirRetrieve`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { BookingID: flyhubId },
    };

    try {
      const response = await axios.request(ticketRetrive);
      return this.flyHubUtil.airRetriveDataTransformerAdmin(
        response?.data,
        BookingID.BookingID,
        findBooking.bookingStatus,
        findBooking.TripType,
        findBooking.bookingDate,
      );
    } catch (error) {
      throw error?.response?.data;
    }
  }

  async convertToFlyAirSearchDto(
    flightSearchModel: FlightSearchModel,
    userIp: string,
  ): Promise<any> {
    const segments = flightSearchModel.segments.map((segment) => ({
      Origin: segment.depfrom,
      Destination: segment.arrto,
      CabinClass: flightSearchModel.cabinclass,
      DepartureDateTime: segment.depdate,
    }));

    const journeyType = this.determineJourneyType(segments);

    const flyAirSearchDto = plainToClass(FlyAirSearchDto, {
      AdultQuantity: flightSearchModel.adultcount,
      ChildQuantity: flightSearchModel.childcount,
      InfantQuantity: flightSearchModel.infantcount,
      EndUserIp: userIp,
      JourneyType: journeyType,
      Segments: segments,
    });
    //console.log(flyAirSearchDto)
    // return flyAirSearchDto
    try {
      return await this.searchFlights(flyAirSearchDto);
    } catch (error) {
      return error;
    }
  }

  private determineJourneyType(segments: any[]): string {
    if (segments.length === 1) {
      return '1';
    }
    if (segments.length === 2) {
      if (
        segments[0].Destination === segments[1].Origin &&
        segments[0].Origin === segments[1].Destination
      ) {
        return '2';
      }
      return '3';
    }
    return '3';
  }

  async makeTicket(BookingID: BookingID) {
    const findBooking = await this.bookingSaveRepository.findOne({
      where: { bookingId: BookingID.BookingID },
      relations: ['user'],
    });
    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID.BookingID },
    });
    if (!bookingId) {
      throw new NotFoundException(
        `No Booking Found with ${BookingID.BookingID}`,
      );
    }
    const flyhubId = bookingId.flyhubId;
    const token = await this.getToken();
    const makeTicket = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirTicketing`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        BookingID: flyhubId,
        IsAcceptedPriceChangeandIssueTicket: true,
      },
    };
    try {
      const response = await axios.request(makeTicket);
      if (response.data.Results !== null) {
        return this.flyHubUtil.airRetriveDataTransformerAdmin(
          response?.data,
          BookingID.BookingID,
          findBooking.bookingStatus,
          findBooking.TripType,
          findBooking.bookingDate,
        );
      }
      return response.data;
    } catch (error) {
      throw error?.response?.data;
    }
  }
}
