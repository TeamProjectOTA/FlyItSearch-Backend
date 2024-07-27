import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FlyHubUtil } from './flyhub.util';
import { plainToClass } from 'class-transformer';
import {
  FlbFlightSearchDto,
  FlyAirSearchDto,
  searchResultDto,
} from './Dto/flyhub.model';
import { FlightSearchModel, JourneyType } from '../flight.model';
import { BookingID } from 'src/book/book.model';
import { Test } from './test.service';

@Injectable()
export class FlyHubService {
  private readonly username: string = process.env.FLYHUB_UserName;
  private readonly apiKey: string = process.env.FLYHUB_ApiKey;
  private readonly apiUrl: string = process.env.FLyHub_Url;
  constructor(
    private readonly flyHubUtil: FlyHubUtil,
    private readonly testutil: Test,
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
      //console.log(token);
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
      //console.log(response.data)
      return this.flyHubUtil.restBFMParser(response.data, reqBody.JourneyType);
     //return response.data
    } catch (error) {
      throw error?.response?.data;
    }
  }

  async aircancel(BookingID: BookingID): Promise<any> {
    const token = await this.getToken();
    const ticketCancel = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirCancel`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: BookingID,
    };

    try {
      const response = await axios.request(ticketCancel);
      return this.flyHubUtil.bookingDataTransformerFlyhb(response.data);
    } catch (error) {
      throw error?.response?.data;
    }
  }
  async airRetrive(BookingID: BookingID): Promise<any> {
    const token = await this.getToken();
    const ticketCancel = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.apiUrl}/AirRetrieve`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: BookingID,
    };

    try {
      const response = await axios.request(ticketCancel);
      return this.flyHubUtil.bookingDataTransformerFlyhb(response.data);
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
      return this.flyHubUtil.restBFMParser(response.data);
    } catch (error) {
      throw error?.response?.data;
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

  async airbook(data: FlbFlightSearchDto) {
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
      const response1 = await axios.request(PreBookticket);
      const response = await axios.request(Bookticket);
      return this.flyHubUtil.bookingDataTransformerFlyhb(response.data);
    } catch (error) {
      throw error?.response?.data;
 
    }
  }

  async convertToFlyAirSearchDto(
    flightSearchModel: FlightSearchModel,userIp:string
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
    return this.searchFlights(flyAirSearchDto);
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

}
