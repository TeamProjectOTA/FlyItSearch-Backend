import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HotelService {
  async getIp(): Promise<any> {
    const url = 'https://httpbin.org/ip';
    try {
      const response = await axios.get(url);
      return response.data; // Return the response data
    } catch (error) {
      throw new Error(`Failed to fetch IP: ${error.message}`);
    }
  }
  async getRedirectUrl(): Promise<string> {
    // Perform any logic here, e.g., fetch URL from a database
    const url = 'https://bdfare.com/api/enterprise';
    return url;
  }
}
