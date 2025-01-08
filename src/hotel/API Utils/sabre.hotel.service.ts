import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as base64 from 'base-64';
import { GetHotelAvailRQDto, RootDto } from '../DTO/hoteldto';
import { SabreHotelUtils } from './sabre.hotel.util';

@Injectable()
export class SabreHotel {
  constructor(private readonly sabreHotelUtils: SabreHotelUtils) {}
  async restToken(): Promise<string> {
    const client_id_raw = `V1:${process.env.SABRE_ID}:${process.env.SABRE_PCC}:AA`;
    const client_id = base64.encode(client_id_raw);
    const client_secret = base64.encode(process.env.SABRE_PASSWORD);
    const token = base64.encode(`${client_id}:${client_secret}`);
    const data = 'grant_type=client_credentials';
    const headers = {
      Authorization: `Basic ${token}`,
      Accept: '/',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    try {
      const response = await axios.post(process.env.SABRE_AUTH_ENDPOINT, data, {
        headers,
      });
      const result = response?.data;
      return result['access_token'];
    } catch (err) {
      console.log(err);
    }
  }

  async sabreHotelRequest(hotelDto: RootDto) {
    const token = await this.restToken();
    const reqBody = hotelDto;
    const shoppingrequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.SABRE_BASE_URL}/v3.0.0/get/hotelavail`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: reqBody,
    };

    try {
      const response = await axios.request(shoppingrequest);
      const result = response?.data?.GetHotelAvailRS?.HotelAvailInfos;
      return await this.sabreHotelUtils.dataTransformer(result);
    } catch (err) {
      console.log(err);
    }
  }
}
