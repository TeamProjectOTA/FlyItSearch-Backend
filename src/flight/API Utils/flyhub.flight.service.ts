import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { FlyAirSearchDto } from "./Dto/flyhub.model";

@Injectable()
export class FlyHubService{
    private readonly username: string = process.env.FLYHUB_UserName;
    private readonly apiKey: string = process.env.FLYHUB_ApiKey;
    private readonly apiUrl:string=process.env.FLyHub_Url;
    constructor( ) {}
    
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
         console.log(response?.data)
          if (!token) {
            throw new HttpException('Token not found in response', HttpStatus.INTERNAL_SERVER_ERROR);
          }
    
          return token;
        } catch (error) {
          console.error('Error fetching token:', error.response?.data || error.message);
          throw new HttpException('Failed to authenticate', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
      async searchFlights(data: any): Promise<any> {
        try {
          const token = await this.getToken();
          const response = await axios.post(`${this.apiUrl}/AirSearch`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
        //   return this.flyHubUtil.restBFMParser(response.data);
        return response.data
        } catch (error) {
          console.error('Error searching flights:', error.response?.data || error.message);
          throw new HttpException('Flight search failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}