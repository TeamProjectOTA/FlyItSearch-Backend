import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HotelService {
  async getIp(): Promise<any> {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      console.log('Public IP Address:', response.data.ip);
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching public IP:', error);
    }
  }

  async getRedirectUrl(): Promise<string> {
    const url = 'https://bdfare.com/api/enterprise';
    return url;
  }
}
