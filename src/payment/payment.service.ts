import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { SslCommerzPayment } from 'sslcommerz';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;

  constructor(
    @InjectRepository(User) private readonly loginRepository: Repository<User>,
  ) {
    this.storeId = process.env.STORE_ID;
    this.storePassword = process.env.STORE_PASSWORD;
    this.isLive = false; // Use true for live environment
  }

  async initiatePayment(passengerId: string): Promise<string> {
    const userData = await this.loginRepository.findOne({
      where: { passengerId: passengerId },
    });

    if (!userData) {
      throw new NotFoundException(
        `User with passengerId ${passengerId} not found`,
      );
    }

    const sslcommerz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `${timestamp}_${randomNumber}`;

    const data = {
      total_amount: 100,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: 'http://localhost:3000/payment/success',
      fail_url: 'http://localhost:3000/payment/fail',
      cancel_url: 'http://localhost:3000/payment/cancel',
      //ipn_url: 'http://localhost:3000/ipn',
      shipping_method: 'NO',
      product_name: 'Air Ticket',
      product_category: 'air ticket',
      product_profile: 'airline-tickets',
      //all the dynamic data should be from here
      hours_till_departure: '24 hrs',
      flight_type: 'Oneway',
      pnr: 'Q123h4',
      journey_from_to: 'DAC-CGP',
      third_party_booking: 'No',
      cus_name: userData.fullName,
      cus_email: userData.email,
      cus_city: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: userData.phone,
    };

    try {
      const apiResponse = await sslcommerz.init(data);
      if (!apiResponse.GatewayPageURL) {
        throw new HttpException(
          'Failed to get payment URL',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return apiResponse.GatewayPageURL;
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw new HttpException(
        'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateOrder(val_id: string) {
    const sslcz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );

    try {
      const response = await sslcz.validate({ val_id });

      if (response.status === 'VALID') {
        return response;
      } else if (response.status === 'INVALID_TRANSACTION') {
        console.error('Invalid transaction:', response);
        throw new HttpException('Invalid transaction', HttpStatus.BAD_REQUEST);
      } else {
        console.error('Unknown validation error:', response);
        throw new HttpException(
          'Failed to validate order',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      console.error('Order validation error:', error);
      throw new HttpException(
        'Failed to validate order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
