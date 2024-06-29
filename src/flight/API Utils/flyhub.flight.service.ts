import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { FlyHubUtil } from './flyhub.util';
import { plainToClass } from 'class-transformer';
import { FlyAirSearchDto } from './Dto/flyhub.model';
import { FlightSearchModel, JourneyType } from '../flight.model';
import { REQUEST } from '@nestjs/core';
import { ShoppingCriteriaDto } from './Dto/bdfare.model';


@Injectable()
export class FlyHubService {
  private readonly username: string = process.env.FLYHUB_UserName;
  private readonly apiKey: string = process.env.FLYHUB_ApiKey;
  private readonly apiUrl: string = process.env.FLyHub_Url;
  constructor(private readonly flyHubUtil: FlyHubUtil,@Inject(REQUEST) private request: Request) {}

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
      console.log(response?.data);
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
   async convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<FlyAirSearchDto> { //Work in progress
    const cabinClassMapping = {
      'Y': 'Economy',
      'S': 'Premium_Economy',
      'C': 'Business',
      'P': 'First',
    };
  
    const segments = flightSearchModel.segments.map(segment => ({
      Origin: segment.depfrom,
      Destination: segment.arrto,
      CabinClass: cabinClassMapping[flightSearchModel.cabinclass],
      DepartureDateTime: segment.depdate.toISOString(),
    }));
  
    const tripType =
      flightSearchModel.segments.length === 1 ? '1' :
      flightSearchModel.segments.length === 2 ? '2' :
      '3';
  
    const flyAirSearchDto = plainToClass(FlyAirSearchDto, {
      AdultQuantity: flightSearchModel.adultcount,
      ChildQuantity: flightSearchModel.childcount,
      InfantQuantity: flightSearchModel.infantcount,
      EndUserIp: "11",
      JourneyType: tripType,
      Segments: segments,
    });
    return await this.searchFlights(flyAirSearchDto);
  }


  async searchFlights(data: any): Promise<any> {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${this.apiUrl}/AirSearch`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return this.flyHubUtil.restBFMParser(response.data);
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
}
