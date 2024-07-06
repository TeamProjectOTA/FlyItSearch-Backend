import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { FlyHubUtil } from './flyhub.util';
import { plainToClass } from 'class-transformer';
import { FlyAirSearchDto } from './Dto/flyhub.model';
import { FlightSearchModel, JourneyType } from '../flight.model';
import { REQUEST } from '@nestjs/core';
import { BookingID } from '../dto/fare-rules.flight.dto';


@Injectable()
export class FlyHubService {
  private readonly username: string = process.env.FLYHUB_UserName;
  private readonly apiKey: string = process.env.FLYHUB_ApiKey;
  private readonly apiUrl: string = process.env.FLyHub_Url;
  constructor(
    private readonly flyHubUtil: FlyHubUtil,
    @Inject(REQUEST) private request: Request,
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
      //console.log(token)
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
  async convertToFlyAirSearchDto(
    flightSearchModel: FlightSearchModel,
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
      EndUserIp: '11',
      JourneyType: journeyType,
      Segments: segments,
    });

    return this.searchFlights(flyAirSearchDto);
  }
  async searchFlights(data: FlyAirSearchDto): Promise<any> {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${this.apiUrl}/AirSearch`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let tripType = data.JourneyType;

      return this.flyHubUtil.restBFMParser(response.data, tripType);
    } catch (error) {
      console.error(
        'Error searching flights:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Flight search failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  async airRetrive(BookingID:BookingID): Promise<any> {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${this.apiUrl}/AirRetrieve`, BookingID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(BookingID)
      return response.data
    } catch (error) {
      console.error()
    }
  }

  async aircancel(BookingID:BookingID):Promise<any>{
    try {
      const token = await this.getToken();
      const response = await axios.post(`${this.apiUrl}/AirCancel`, BookingID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(BookingID)
      return response.data
    } catch (error) {
      console.error()
    }
  }


  async airbook(){
    return 'This is the air book api'
  }

  
}
