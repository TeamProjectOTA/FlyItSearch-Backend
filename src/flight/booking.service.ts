import { Injectable } from '@nestjs/common';

interface AgentData {
  name: string;
  age: number;
}
interface PriceCheckResult {
  IsBookable: boolean;
}

@Injectable()
export class BookingService {
  constructor() {}

  async createBooking(
    agentdata: AgentData[],
    path: string,
    bookingDto: any,
    priceCheckResult: PriceCheckResult,
  ): Promise<any> {
    return { success: true, agentdata };
  }
}
