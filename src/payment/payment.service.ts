import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
import { Wallet } from 'src/deposit/deposit.model';
import { Transection } from 'src/transection/transection.model';
import { User } from 'src/user/entities/user.entity';
import { SslCommerzPayment } from 'sslcommerz';
import * as ShurjoPay from 'shurjopay-js';

import {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} from 'bkash-payment';
import { Repository } from 'typeorm';
@Injectable()
export class PaymentService {
  private readonly sslcommerzsslcommerzStoreId: string;
  private readonly sslcommerzStorePwd: string;
  private readonly isLive: boolean;
  private bkashBaseUrl: string; // Update this with the correct URL from bKash
  private bkashAppKey: string;
  private bkashAppSecret: string;
  private bkashUserName: string;
  private bkashPwd: string;
  private bkashConfig: any;
  private surjoBaseUrl:string
  private surjoUserName:string
  private surjoPassword:string
  private surjoPrefix:string

  constructor(
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(Transection)
    private readonly transectionRepository: Repository<Transection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly authService: AuthService,
  ) {
    this.sslcommerzsslcommerzStoreId = process.env.STORE_ID;
    this.sslcommerzStorePwd = process.env.STORE_PASSWORD;
    this.isLive = false; // Use true for live environment
    this.bkashConfig = {
      base_url: process.env.BKASH_BASE_URL,
      username: process.env.BKASH_USERNAME,
      password: process.env.BKASH_USERNAME,
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    };
    this.surjoBaseUrl = process.env.SURJO_API_Url;
    this.surjoUserName=process.env.SURJO_API_USRNAME;
    this.surjoPassword=process.env.SURJO_API_PASSWORD;
    this.surjoPrefix=process.env.SURJO_API_PREFIX
  }
  async dataModification(SearchResponse: any, header: any): Promise<any> {
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
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.035); // !Important some check the validation before adding the ammont. 2.5% charge added in sslcomerz
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
    const depfrom = booking?.AllLegsInfo[0]?.DepFrom || 'DAC';
    const arrto =
      booking?.AllLegsInfo[(booking?.AllLegsInfo).length - 1]?.ArrTo || 'DXB';
    const bookingId = booking?.BookingId;
    const paymentData = {
      total_amount: total_amount,
      hours_till_departure: hours_till_departure,
      flight_type: tripType,
      pnr: pnr,
      journey_from_to: `${depfrom}-${arrto}`,
      cus_name: name,
      cus_email: email,
      cus_city: city,
      cus_postcode: postCode,
      cus_country: 'Bangladesh',
      cus_phone: phone,
    };
    return {
      url: await this.initiatePayment(paymentData, bookingId, header),
      airTicketPrice: airTicketPrice,
      paymentGatwayCharge: paymentGatwayCharge,
      total_amount: total_amount,
    };
  }
  async initiatePayment(
    paymentData: any,
    bookingId: string,
    header: any,
  ): Promise<string> {
    const sslcommerz = new SslCommerzPayment(
      this.sslcommerzsslcommerzStoreId,
      this.sslcommerzStorePwd,
      this.isLive,
    );
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;

    const email = await this.authService.decodeToken(header);

    const bookingSave = await this.bookingSaveRepository.findOne({
      where: { bookingId: bookingId },
    });

    if (bookingSave.bookingStatus == 'Booked') {
      const data = {
        total_amount: paymentData.total_amount,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `http://localhost:8080/payment/success/${bookingId}/${email}`,
        fail_url: 'http://localhost:8080/payment/fail',
        cancel_url: 'http://localhost:8080/payment/cancel',
        ipn_url: 'http://localhost:8080/payment/ipn',
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
        return apiResponse?.GatewayPageURL;
      } catch (error) {
        console.log(error);
        return error;
      }
    } else {
      return `The booking with ${bookingId} id was already ${bookingSave.bookingStatus}`;
    }
  }

  async validateOrder(val_id: string, bookingId?: any, email?: any) {
    const sslcommerz = new SslCommerzPayment(
      this.sslcommerzsslcommerzStoreId,
      this.sslcommerzStorePwd,
      this.isLive,
    );

    const validationData = {
      val_id: val_id,
    };

    try {
      const response = await sslcommerz.validate(validationData);

      if (response.status === 'VALID') {
        const user = await this.userRepository.findOne({
          where: { email: email },
        });
        const bookingSave = await this.bookingSaveRepository.findOne({
          where: { bookingId: bookingId },
        });
        bookingSave.bookingStatus = 'IssueInProcess';

        await this.bookingSaveRepository.save(bookingSave);

        const wallet = await this.walletRepository
          .createQueryBuilder('wallet')
          .innerJoinAndSelect('wallet.user', 'user')
          .where('user.email = :email', { email })
          .getOne();

        const airPlaneName = bookingSave.Curriername;
        const tripType = bookingSave.TripType;
        const depfrom = bookingSave?.laginfo[0]?.DepFrom;
        const arrto =
          bookingSave?.laginfo[(bookingSave?.laginfo).length - 1]?.ArrTo;
        let addTransection: Transection = new Transection();
        addTransection.tranId = response.tran_id;
        addTransection.tranDate = response.tran_date;
        addTransection.paidAmount = response.amount;
        addTransection.offerAmmount = response.store_amount;
        addTransection.bankTranId = response.bank_tran_id;
        addTransection.riskTitle = response.risk_title;
        addTransection.cardType = response.card_type;
        addTransection.cardIssuer = response.card_issuer;
        addTransection.cardBrand = response.card_brand;
        addTransection.cardIssuerCountry = response.card_issuer_country;
        addTransection.validationDate = response.validated_on;
        addTransection.status = 'Purchase';
        addTransection.walletBalance = wallet.ammount;
        addTransection.paymentType = 'Instaint Payment ';
        addTransection.currierName = airPlaneName;
        addTransection.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
        addTransection.bookingId = bookingId;
        addTransection.user = user;
        await this.transectionRepository.save(addTransection);
      }
      return response;
    } catch (error) {
      console.error('Error during payment validation:', error);
      throw new Error('Payment validation failed.');
    }
  }

  async initiatePaymentBkash(amount: number) {
    const createPaymentRequest = {
      amount: amount.toString(),
      currency: 'BDT',
      intent: 'sale',
      callbackURL: process.env.BKASH_CALLBACKURL,
      merchantInvoiceNumber: 'INV123456', 
    };

    try {
      const response = await createPayment(
        this.bkashConfig,
        createPaymentRequest,
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async executeBkashPayment(paymentID: string) {
    try {
      const response = await executePayment(this.bkashConfig, paymentID);
      return response;
    } catch (error) {
      throw new Error(`Failed to execute payment: ${error.message}`);
    }
  }

  async queryBkashPayment(paymentID: string) {
    try {
      const response = await queryPayment(this.bkashConfig, paymentID);
      return response;
    } catch (error) {
      throw new Error(`Failed to query payment: ${error.message}`);
    }
  }

  async searchTransaction(trxID: string) {
    try {
      const response = await searchTransaction(this.bkashConfig, trxID);
      return response;
    } catch (error) {
      throw new Error(`Failed to search transaction: ${error.message}`);
    }
  }

  async refundTransaction(paymentID: string, amount: number, trxID: string) {
    try {
      const response = await refundTransaction(
        this.bkashConfig,
        paymentID,
        amount.toString(),
        trxID,
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to refund transaction: ${error.message}`);
    }
  }

  async checkCredentials() {
    const url = `${this.bkashBaseUrl}/tokenized/checkout/token/grant`;
    const data = {
      app_key: this.bkashAppKey,
      app_secret: this.bkashAppSecret,
    };

    try {
      const response = await axios.post(url, data, {
        auth: {
          username: this.bkashUserName,
          password: this.bkashPwd,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to validate credentials:', error);
      throw new Error('Invalid credentials');
    }
  }


async formdata(SearchResponse?: any, header?: any){
  const email = await this.authService.decodeToken(header);
  const user = await this.userRepository.findOne({
    where: { email: email },
  });
  const booking = SearchResponse[0];
  const airTicketPrice = booking?.NetFare;
  const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.02); // !Important some check the validation before adding the ammont. 2.0% charge added in SurjoPay
  const total_amount = Math.ceil(airTicketPrice + paymentGatwayCharge);
  const bookingID=booking.BookingId
 const data={
    amount: total_amount,
    currency: "BDT",
    customer_name: user.fullName,
    customer_address: "Dhaka",
    customer_phone: user.phone,
    customer_city: "Dhaka",
    customer_email: email,
}
return{ url: await this.surjoMakePayment(data,bookingID,header),
  airTicketPrice: airTicketPrice,
  paymentGatwayCharge: paymentGatwayCharge,
  total_amount: total_amount,}

}

  async surjoAuthentication() {
    let details:any
    try {
      const response = await axios.post(`${this.surjoBaseUrl}/api/get_token`, {
        username: this.surjoUserName,
        password: this.surjoPassword,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      details=response.data
    } catch (error) {
      console.error("Error authenticating:", error.response ? error.response.data : error.message);
    }
    return details ;
  }

  async surjoMakePayment(data:any,bookingId:string,header:any) {
    const tokenDetails = await this.surjoAuthentication();
    const { token, token_type, store_id } = tokenDetails;
    const bookingID=bookingId
    const email = await this.authService.decodeToken(header);
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;
    const formData= data
    try {
      const response = await axios.post(`${this.surjoBaseUrl}/api/secret-pay`, {
        prefix: this.surjoPrefix,
        store_id: store_id,
        token: token,
        return_url: `http://localhost:8080/payment/return/${bookingID}/${email}`, // Dynamic return URL
        cancel_url: 'http://localhost:8080/payment/cancel',
        order_id: tran_id,
        client_ip:'192.67.2',
        ...formData,
      }, {
        headers: {
          authorization: `${token_type} ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.checkout_url; // Payment response
    } catch (error) {
      console.error("Error making payment:", error.response ? error.response.data : error.message);
      return "Payment Failed";
    }
  }


  async surjoVerifyPayment(sp_order_id: string,bookingID:string,email:string) {
  
    const tokenDetails = await this.surjoAuthentication();
    const { token, token_type } = tokenDetails;
 

    try {
      const response = await axios.post(`${this.surjoBaseUrl}/api/verification`, {
        order_id: sp_order_id,
      }, {
        headers: {
          authorization: `${token_type} ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data= response.data[0];
      if (data.sp_message === 'Success') {
        const user = await this.userRepository.findOne({
          where: { email: email },
        });
        const bookingSave = await this.bookingSaveRepository.findOne({
          where: { bookingId: bookingID },
        });
        bookingSave.bookingStatus = 'IssueInProcess';

        await this.bookingSaveRepository.save(bookingSave);

        const wallet = await this.walletRepository
          .createQueryBuilder('wallet')
          .innerJoinAndSelect('wallet.user', 'user')
          .where('user.email = :email', { email })
          .getOne();

        const airPlaneName = bookingSave.Curriername;
        const tripType = bookingSave.TripType;
        const depfrom = bookingSave?.laginfo[0]?.DepFrom;
        const arrto =
          bookingSave?.laginfo[(bookingSave?.laginfo).length - 1]?.ArrTo;
        let addTransection: Transection = new Transection();
        addTransection.tranId = data.customer_order_id;
        addTransection.tranDate = data.date_time;
        addTransection.paidAmount = data.amount;
        addTransection.offerAmmount = data.received_amount;
        addTransection.bankTranId = data.bank_trx_id;
        addTransection.riskTitle = 'safe';
        addTransection.cardType = 'Surjo-Pay';
        addTransection.cardIssuer = `${data.method}-InternetBanking`;
        addTransection.cardBrand = data.method;
        addTransection.cardIssuerCountry = 'BD';
        addTransection.validationDate = data.date_time;
        addTransection.status = 'Purchase';
        addTransection.walletBalance = wallet.ammount;
        addTransection.paymentType = 'Instaint Payment ';
        addTransection.currierName = airPlaneName;
        addTransection.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
        addTransection.bookingId = bookingID;
        addTransection.user = user;
        await this.transectionRepository.save(addTransection);
      }
      return data
    } catch (error) {
      console.error("Error verifying payment:", error.response ? error.response.data : error.message);
      return "Payment Verification Failed";
    }
    
    
  }
}

