import { Injectable } from '@nestjs/common';
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
    this.isLive = false;
  }

  async initiatePayment(passengerId: string): Promise<string> {
    const userData = await this.loginRepository.findOne({
      where: { passengerId: passengerId },
    });
    const sslcommerz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const tran_id = Date.now().toString(36);
    const data = {
      total_amount: 100,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: 'http://localhost:3000/payment/success',
      fail_url: 'http://localhost:3000/payment/fail',
      cancel_url: 'http://localhost:3000/payment/cancel',
      ipn_url: 'http://localhost:3000/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: userData.fullName,
      cus_email: userData.email,
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
    };
    try {
      const apiResponse = await sslcommerz.init(data);

      return apiResponse.GatewayPageURL;
    } catch (error) {
      throw new Error('Failed to initiate payment');
    }
  }
  async validateOrder(val_id: string) {
    const sslcz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const data = { val_id };
    try {
      const response = await sslcz.validate(data);

      return response;
    } catch (error) {
      throw new Error('Failed to validate order');
    }
  }
}
