import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
import { Wallet } from 'src/deposit/deposit.model';
import { Transection } from 'src/transection/transection.model';
import { User } from 'src/user/entities/user.entity';
import { SslCommerzPayment } from 'sslcommerz';

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
  private bkashConfig: any;
  private surjoBaseUrl: string;
  private surjoUserName: string;
  private surjoPassword: string;
  private surjoPrefix: string;

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
      password: process.env.BAKSH_PASSWORD,
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    };

    this.surjoBaseUrl = process.env.SURJO_API_Url;
    this.surjoUserName = process.env.SURJO_API_USRNAME;
    this.surjoPassword = process.env.SURJO_API_PASSWORD;
    this.surjoPrefix = process.env.SURJO_API_PREFIX;
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
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.025); // !Important some check the validation before adding the ammont. 2.5% charge added in sslcomerz
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
        success_url: `${process.env.BASE_CALLBACKURL}payment/success/${bookingId}/${email}`,
        fail_url: `${process.env.BASE_CALLBACKURL}payment/fail`,
        cancel_url: `${process.env.BASE_CALLBACKURL}payment/cancel`,
        ipn_url: `${process.env.BASE_CALLBACKURL}payment/ipn`,
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
        addTransection.paymentType = 'Instant Payment ';
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

  async bkashInit(SearchResponse: any, header: any) {
    const booking = SearchResponse[0];
    const airTicketPrice = booking?.NetFare;
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.0125); // !Important some check the validation before adding the ammont.1.25% charge added in Bkash
    const total_amount = Math.ceil(airTicketPrice + paymentGatwayCharge);
    const bookingId = booking?.BookingId;
    return {
      url: await this.createPaymentBkash(
        total_amount,
        bookingId,
        header,
        String(airTicketPrice),
      ),
      airTicketPrice: airTicketPrice,
      paymentGatwayCharge: paymentGatwayCharge,
      total_amount: total_amount,
    };
  }

  async createPaymentBkash(
    amount: number,
    bookingId: string,
    header: any,
    netAmount: string,
  ) {
    const email = await this.authService.decodeToken(header);
    const bookingSave = await this.bookingSaveRepository.findOne({
      where: { bookingId: bookingId },
    });

    if (bookingSave.bookingStatus == 'Booked') {
      try {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const tran_id = `SSM${timestamp}${randomNumber}`;

        const paymentDetails = {
          amount: amount || 10,
          callbackURL: `${process.env.BASE_CALLBACKURL}payment/callback/${bookingId}/${netAmount}`,
          orderID: tran_id || 'Order_101',
          reference: `${email}`,
        };

        const result = await createPayment(this.bkashConfig, paymentDetails);
        return result.bkashURL;
      } catch (e) {
        console.log(e);
      }
    } else {
      return `The booking with ${bookingId} id was already ${bookingSave.bookingStatus}`;
    }
  }

  async executePaymentBkash(
    paymentID: string,
    status: string,
    bookingId: string,
    res: any,
    offerAmount: string,
  ) {
    try {
      if (status === 'success') {
        const result: any = await executePayment(this.bkashConfig, paymentID);
        if (
          result?.transactionStatus === 'Completed' &&
          result?.statusMessage === 'Successful'
        ) {
          const tranDate = result.paymentExecuteTime
            .split(' GMT')[0]
            .replace('T', ' ');
          const email = result.payerReference;
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

          const amount = parseFloat(result.amount);

          if (isNaN(amount)) {
            throw new Error('Invalid amount value');
          }

          let addTransection: Transection = new Transection();
          addTransection.tranId = result.merchantInvoiceNumber;
          addTransection.tranDate = tranDate;
          addTransection.paidAmount = amount;
          addTransection.offerAmmount = Number(offerAmount);
          addTransection.bankTranId = result?.trxID;
          addTransection.paymentId = result?.paymentID;
          addTransection.riskTitle = 'Safe';
          addTransection.cardType = 'Bkash';
          addTransection.cardIssuer = 'Bkash';
          addTransection.cardBrand = result.payerAccount;
          addTransection.cardIssuerCountry = 'Bangladesh';
          addTransection.validationDate = tranDate;
          addTransection.status = 'Purchase';
          addTransection.walletBalance = wallet.ammount;
          addTransection.paymentType = 'Instant Payment ';
          addTransection.currierName = airPlaneName;
          addTransection.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
          addTransection.bookingId = bookingId;
          addTransection.user = user;
          await this.transectionRepository.save(addTransection);
          return res.redirect(process.env.SUCCESS_CALLBACK);
        }
        return res.redirect(process.env.FAILED_BKASH_CALLBACK);
      } else {
        return res.redirect(process.env.FAIELD_CALLBACK);
      }
    } catch (e) {
      console.error('Error executing payment:', e);
      throw new Error('Payment execution failed');
    }
  }

  // async queryPayment(paymentId: string): Promise<any> {
  //   try {
  //     if (!paymentId) {
  //       throw new Error("Payment ID is required for querying payment.");
  //     }
  //     const queryResponse = await queryPayment( this.bkashConfig,paymentId);

  //     return queryResponse;
  //   } catch (error) {
  //     console.error(`Error querying payment: ${error.message}`);
  //     throw new Error(`Error querying payment: ${error.message}`);
  //   }
  // }

  async searchTransaction(transactionId: string): Promise<any> {
    try {
      const searchResponse = await searchTransaction(
        this.bkashConfig,
        transactionId,
      );
      return searchResponse;
    } catch (error) {
      throw new Error(`Error searching transaction: ${error.message}`);
    }
  }

  async refundTransaction(
    paymentId: string,
    amount: number,
    trxID: string,
    email: string,
  ): Promise<any> {
    try {
      const refundDetails = {
        paymentID: paymentId,
        trxID: trxID,
        amount: amount,
      };
      const refundResponse = await refundTransaction(
        this.bkashConfig,
        refundDetails,
      );
      if (
        refundResponse.statusMessage === 'Successful' &&
        refundResponse.transactionStatus === 'Completed'
      ) {
        const trx_id = refundResponse.originalTrxID;
        const transaction = await this.transectionRepository.findOne({
          where: { bankTranId: trx_id },
        });
        if (!transaction) {
          throw new Error(`Transaction with ID ${trx_id} not found.`);
        }
        const user = await this.userRepository.findOne({
          where: { email },
          relations: ['wallet'],
        });

        if (!user || !user.wallet) {
          throw new Error(`User or Wallet not found for email: ${email}`);
        }

        if (transaction.status === 'Deposited') {
          transaction.status = 'Refunded';
          transaction.refundAmount = amount;
          user.wallet.ammount = Number(user.wallet.ammount) - Number(amount);
          await this.walletRepository.save(user.wallet);
          transaction.walletBalance = user.wallet.ammount;
        } else {
          transaction.status = 'Refunded';
          transaction.refundAmount = amount;
        }
        await this.transectionRepository.save(transaction);
      }

      return refundResponse;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      });
      throw new Error(
        `Error refunding transaction: ${error.message}. Response: ${error.response?.data || 'No additional information available.'}`,
      );
    }
  }

  //surjo
  async formdata(SearchResponse?: any, header?: any,userIp?:any) {
    const email = await this.authService.decodeToken(header);
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    const booking = SearchResponse[0];
    const airTicketPrice = booking?.NetFare;
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.02); // !Important some check the validation before adding the ammont. 2.0% charge added in SurjoPay
    const total_amount = Math.ceil(airTicketPrice + paymentGatwayCharge);
    const bookingID = booking.BookingId;
    const data = {
      amount: airTicketPrice,
      currency: 'BDT',
      customer_name: user.fullName,
      customer_address: 'Dhaka',
      customer_phone: user.phone,
      customer_city: 'Dhaka',
      customer_email: email,
    };
    return {
      url: await this.surjoMakePayment(data, bookingID, header,userIp),
      airTicketPrice: airTicketPrice,
      paymentGatwayCharge: paymentGatwayCharge,
      total_amount: total_amount,
    };
  }

  async surjoAuthentication() {
    let details: any;
    const surjo = `${this.surjoBaseUrl}/api/get_token`;

    const authPayload = {
      username: this.surjoUserName,
      password: this.surjoPassword,
    };
    
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };    
    try {
      const response = await axios.post(surjo,authPayload,requestOptions);
      details = response.data;
    } catch (error) {
      console.error(
        'Error authenticating:',
        error.response ? error.response.data : error.message,
      );
    }

    return details;
  }

  async surjoMakePayment(data: any, bookingId: string, header: any,userIp:any) {
    const tokenDetails = await this.surjoAuthentication();
    const { token, token_type, store_id } = tokenDetails;
    const bookingID = bookingId;
    const email = await this.authService.decodeToken(header);
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;
    const formData = data;
    const bookingSave = await this.bookingSaveRepository.findOne({
      where: { bookingId: bookingId },
    });

    if (bookingSave.bookingStatus == 'Booked') {
      try {
        const response = await axios.post(
          `${this.surjoBaseUrl}/api/secret-pay`,
          {
            prefix: this.surjoPrefix,
            store_id: store_id,
            token: token,
            return_url: `${process.env.BASE_CALLBACKURL}payment/return/${bookingID}/${email}`,
            cancel_url: `${process.env.BASE_CALLBACKURL}payment/cancel`,
            order_id: tran_id,
            client_ip: userIp||'192.67.5',
            ...formData,
          },
          {
            headers: {
              authorization: `${token_type} ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        return response.data.checkout_url; // Payment response
      } catch (error) {
        console.error(
          'Error making payment:',
          error.response ? error.response.data : error.message,
        );
        return 'Payment Failed';
      }
    } else {
      return `The booking with ${bookingId} id was already ${bookingSave.bookingStatus}`;
    }
  }

  async surjoVerifyPayment(
    sp_order_id: string,
    bookingID: string,
    email: string,
    res: any,
  ) {
    const tokenDetails = await this.surjoAuthentication();
    const { token, token_type } = tokenDetails;

    try {
      const response = await axios.post(
        `${this.surjoBaseUrl}/api/verification`,
        {
          order_id: sp_order_id,
        },
        {
          headers: {
            authorization: `${token_type} ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = response.data[0];
      if (data.sp_code=== '1000') {
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
        addTransection.paymentType = 'Instant Payment ';
        addTransection.currierName = airPlaneName;
        addTransection.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
        addTransection.bookingId = bookingID;
        addTransection.user = user;
        await this.transectionRepository.save(addTransection);
        return res.redirect(process.env.SUCCESS_CALLBACK)
      }else {
        return res.redirect(process.env.FAILED_BKASH_CALLBACK);
      }
    } catch (error) {
      console.error(
        'Error verifying payment:',
        error.response ? error.response.data : error.message,
      );
      return res.redirect(process.env.FAILED_BKASH_CALLBACK);
    }
  }
}
