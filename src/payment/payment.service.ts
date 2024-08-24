import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SslCommerzPayment } from 'sslcommerz';
@Injectable()
export class PaymentService {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;

  constructor() {
    this.storeId = process.env.STORE_ID;
    this.storePassword = process.env.STORE_PASSWORD;
    this.isLive = false; // Use true for live environment
  }
  async dataModification(SearchResponse: any): Promise<any> {
    const booking = SearchResponse[0];
    let tripType: string;
    if (booking?.AllLegsInfo?.length === 1) {
      tripType = 'OneWay';
    } else if (booking?.AllLegsInfo?.length === 2) {
      if (
        booking?.AllLegsInfo[0]?.ArrTo === booking?.AllLegsInfo[1]?.DepFrom &&
        booking?.AllLegsInfo[0]?.DepFrom === booking?.AllLegsInfo[1]?.ArrTo
      ) {
        tripType = 'Return';
      } else {
        tripType = 'Multistop';
      }
    } else {
      tripType = 'Multistop';
    }

    const flightDateTime = new Date(booking?.AllLegsInfo[0]?.DepDate);
    const currentDateTime = new Date();

    const timeDifference = flightDateTime.getTime() - currentDateTime.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    const airTicketPrice = booking?.NetFare;
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.025);
    const total_amount = Math.ceil(airTicketPrice + paymentGatwayCharge);
    const hours_till_departure = ` ${hoursDifference} hrs ${minutesDifference} mins`;
    const pnr = booking?.PNR;
    const passenger = booking?.PassengerList?.[0];
    const name =
      `${passenger?.FirstName || ''} ${passenger?.LastName || ''}`.trim();
    const email = passenger?.Email;
    const city = passenger?.CountryCode;
    const postCode = '1206';
    const phone = passenger?.ContactNumber;

    //console.log(hours_till_departure)
    const paymentData = {
      total_amount: total_amount,
      hours_till_departure: hours_till_departure,
      flight_type: tripType,
      pnr: pnr,
      journey_from_to: 'DAC-CGP',
      cus_name: name,
      cus_email: email,
      cus_city: city,
      cus_postcode: postCode,
      cus_country: 'Bangladesh',
      cus_phone: phone,
    };

    return {
      url: await this.initiatePayment(paymentData),
      airTicketPrice: airTicketPrice,
      paymentGatwayCharge: paymentGatwayCharge,
      total_amount: total_amount,
    };
  }
  async initiatePayment(paymentData: any): Promise<string> {
    const sslcommerz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `${timestamp}_${randomNumber}`;

    const data = {
      total_amount: paymentData.total_amount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: 'http://localhost:8080/payment/success',
      fail_url: 'http://localhost:8080/payment/fail',
      cancel_url: 'http://localhost:8080/payment/cancel',
      shipping_method: 'NO',
      product_name: 'Air Ticket',
      product_category: 'air ticket',
      product_profile: 'airline-tickets',
      hours_till_departure: paymentData.hours_till_departure,
      flight_type: paymentData.flight_type,
      pnr: paymentData.pnr,
      journey_from_to: paymentData.journey_from_to,
      third_party_booking: 'No',
      cus_name: paymentData.cus_name,
      cus_email: paymentData.cus_email,
      cus_city: paymentData.cus_city,
      cus_postcode: paymentData.cus_postcode,
      cus_country: 'Bangladesh',
      cus_phone: paymentData.cus_phone,
    };

    try {
      const apiResponse = await sslcommerz.init(data);
      //console.log('apiresponse: ' ,apiResponse.GatewayPageURL)
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

  // async validateOrder(val_id: string) {
  //   const sslcommerz = new SslCommerzPayment(this.storeId, this.storePassword, this.isLive);

  //   try {
  //     const response = await sslcommerz.validate({ val_id });

  //     if (response.status === 'VALID') {
  //       return response;
  //     } else if (response.status === 'INVALID_TRANSACTION') {
  //       console.error('Invalid transaction:', response);
  //       throw new HttpException('Invalid transaction', HttpStatus.BAD_REQUEST);
  //     } else {
  //       console.error('Unknown validation error:', response);
  //       throw new HttpException('Failed to validate order', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   } catch (error) {
  //     console.error('Order validation error:', error);
  //     throw new HttpException('Failed to validate order', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
