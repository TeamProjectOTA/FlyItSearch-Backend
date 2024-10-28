import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Deposit, Wallet } from './deposit.model';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Transection } from 'src/transection/transection.model';
import { SslCommerzPayment } from 'sslcommerz';
import { Storage } from '@google-cloud/storage';
import { PaymentService } from 'src/payment/payment.service';
import axios from 'axios';
import {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} from 'bkash-payment';
@Injectable()
export class DepositService {
  private readonly sslcommerzsslcommerzStoreId: string;
  private readonly sslcommerzStorePwd: string;
  private readonly isLive: boolean;
  private storage: Storage;
  private bucket: string;
  private surjoBaseUrl: string;
  private surjoPrefix: string;
  private bkashConfig: any;
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transection)
    private readonly transectionRepository: Repository<Transection>,
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService,
  ) {
    this.sslcommerzsslcommerzStoreId = process.env.STORE_ID;
    this.sslcommerzStorePwd = process.env.STORE_PASSWORD;
    this.surjoBaseUrl = process.env.SURJO_API_Url;
    this.surjoPrefix = process.env.SURJO_API_PREFIX;
    this.isLive = false;
    this.bkashConfig = {
      base_url: process.env.BKASH_BASE_URL,
      username: process.env.BKASH_USERNAME,
      password: process.env.BAKSH_PASSWORD,
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    };
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
    });
    this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
  }

  async createDeposit(
    depositData: Partial<Deposit>,
    header: any,
    file: Express.Multer.File, // Handle the file here
  ): Promise<Deposit> {
    const email = await this.authService.decodeToken(header);
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const random_id = `FSD${timestamp}${randomNumber}`;

    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    const folderName = 'DepositImage';
    const receiptFilename = `${folderName}/${random_id}_receipt.jpg`;
    const gcsFile = this.storage.bucket(this.bucket).file(receiptFilename);

    try {
      await gcsFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
        public: true,
      });
    } catch (error) {
      console.error('Error uploading to GCS:', error.message);
      throw new Error('Failed to upload receipt image');
    }
    const receiptImageUrl = `https://storage.googleapis.com/${this.bucket}/${receiptFilename}`;
    const deposit = this.depositRepository.create({
      ...depositData,
      depositId: random_id,
      createdAt: dhakaTimeFormatted,
      status: 'Pending',
      user,
      receiptImage: receiptImageUrl,
    });

    try {
      return await this.depositRepository.save(deposit);
    } catch (error) {
      console.error('Error saving deposit:', error.message);
      throw new InternalServerErrorException('Failed to save deposit');
    }
  }

  async getDepositforUser(header: any): Promise<any> {
    const email = await this.authService.decodeToken(header);

    const userWithDeposits = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.deposit', 'deposit')
      .where('user.email = :email', { email })
      .orderBy('deposit.id', 'DESC')
      .getOne();

    if (!userWithDeposits) {
      throw new NotFoundException('User not found');
    }
    return userWithDeposits.deposit;
  }

  async findAllDeposit() {
    return this.depositRepository.find({
      order: { id: 'DESC' },
      relations: ['user'],
    });
  }

  async updateDepositStatus(
    depositId: string,
    updateData: { status: string; rejectionReason?: string },
  ): Promise<Deposit> {
    const deposit = await this.depositRepository.findOne({
      where: { depositId: depositId },
      relations: ['user'],
    });
    const userEmail = deposit.user.email;
    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }
    if (deposit.actionAt) {
      throw new ConflictException(
        `The action was already taken at ${deposit.actionAt}`,
      );
    }
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    deposit.status = updateData.status;
    deposit.actionAt = dhakaTimeFormatted;
    // if(deposit.status='Approved'&& !deposit.rejectionReason){
    //   return
    // }
    deposit.rejectionReason = updateData.rejectionReason;
    if (updateData.status == 'Approved') {
      let addTransection: Transection = new Transection();
      addTransection.tranId = deposit.depositId;
      addTransection.user = deposit.user;
      addTransection.tranDate = moment
        .utc(deposit.createdAt)
        .format('YYYY-MM-DD HH:mm:ss');
      addTransection.requestType = `${deposit.depositType} Transfar`;
      addTransection.bankTranId = deposit.referance;
      addTransection.paidAmount = deposit.ammount.toString();
      addTransection.status = 'Deposited';
      addTransection.riskTitle = 'Checked OK';
      addTransection.validationDate = moment
        .utc(deposit.actionAt)
        .format('YYYY-MM-DD HH:mm:ss');
      const findUser = await this.userRepository.findOne({
        where: { email: userEmail },
        relations: ['wallet'],
      });
      addTransection.walletBalance = findUser.wallet.ammount + deposit.ammount;
      findUser.wallet.ammount = findUser.wallet.ammount + deposit.ammount;
      addTransection.paymentType = 'Money added';
      await this.walletRepository.save(findUser.wallet);
      await this.transectionRepository.save(addTransection);
    }
    return await this.depositRepository.save(deposit);
  }
  async wallet(header: any) {
    const email = await this.authService.decodeToken(header);
    const wallet = await this.userRepository.findOne({
      where: { email: email },
      relations: ['wallet'],
    });
    return wallet.wallet;
  }
  async sslcommerzPaymentInit(header: any, amount: number) {
    const sslcommerz = new SslCommerzPayment(
      this.sslcommerzsslcommerzStoreId,
      this.sslcommerzStorePwd,
      this.isLive,
    );
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `FSD${timestamp}${randomNumber}`;
    const email = await this.authService.decodeToken(header);
    const user = await this.userRepository.findOne({ where: { email: email } });

    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${process.env.BASE_CALLBACKURL}deposit/sslcommerz/success/${email}/${amount}`,
       fail_url: `${process.env.BASE_CALLBACKURL}payment/fail`,
        cancel_url: `${process.env.BASE_CALLBACKURL}payment/cancel`,
        ipn_url: `${process.env.BASE_CALLBACKURL}payment/ipn`,
      shipping_method: 'NO',
      product_name: 'Deposit money',
      product_category: 'Deposit money',
      product_profile: 'general',
      cus_name: user.fullName,
      cus_email: user.email,
      cus_country: 'Bangladesh',
      cus_phone: user.phone,
    };
    const apiResponse = await sslcommerz.init(data);
    return { sslcommerz: apiResponse?.GatewayPageURL };
  }
  async validateOrder(val_id: string, email: string, amount: number) {
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

      if (response?.status === 'VALID') {
        const user = await this.userRepository.findOne({
          where: { email: email },
        });

        let addTransection: Transection = new Transection();
        addTransection.tranId = response.tran_id;
        addTransection.tranDate = response.tran_date;
        addTransection.paidAmount = String(amount);
        addTransection.offerAmmount = String(Math.floor(response.store_amount));
        addTransection.bankTranId = response.bank_tran_id;
        addTransection.riskTitle = response.risk_title;
        addTransection.cardType = response.card_type;
        addTransection.cardIssuer = response.card_issuer;
        addTransection.cardBrand = response.card_brand;
        addTransection.cardIssuerCountry = response.card_issuer_country;
        addTransection.validationDate = response.validated_on;
        addTransection.status = 'Deposited';
        const findUser = await this.userRepository.findOne({
          where: { email: email },
          relations: ['wallet'],
        });
        addTransection.walletBalance =
          findUser.wallet.ammount + Math.floor(response.store_amount);
        findUser.wallet.ammount =
          findUser.wallet.ammount + Math.floor(response.store_amount);
        addTransection.paymentType = 'Instaint Payment ';
        addTransection.requestType = `Instaint Money added `;
        addTransection.user = user;

        await this.walletRepository.save(findUser.wallet);
        await this.transectionRepository.save(addTransection);
        let addDeposit: Deposit = new Deposit();
        addDeposit.user = user;
        addDeposit.ammount = Math.floor(response.store_amount);
        addDeposit.depositId = response?.tran_id;
        addDeposit.depositedFrom = response?.card_brand;
        addDeposit.senderName = user.fullName;
        addDeposit.createdAt = moment
          .utc(response.tran_date)
          .format('YYYY-MM-DD HH:mm:ss');
        addDeposit.actionAt = moment
          .utc(response.tran_date)
          .format('YYYY-MM-DD HH:mm:ss');
        addDeposit.status = 'Instant Deposit';
        addDeposit.depositType = response?.card_brand;

        await this.depositRepository.save(addDeposit);
        return response;
      } else {
        throw new Error('Payment validation failed. Invalid status.');
      }
    } catch (error) {
      console.error('Error validating payment:', error);
      throw new Error('Error occurred during payment validation.');
    }
  }
  async surjoPayInit(header: any, amount: number) {
    const email = await this.authService.decodeToken(header);
    const user = await this.userRepository.findOne({ where: { email: email } });
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tokenDetails = await this.paymentService.surjoAuthentication();
    const { token, token_type, store_id } = tokenDetails;
    const tran_id = `FSD${timestamp}${randomNumber}`;
    const data = {
      amount: amount,
      currency: 'BDT',
      customer_name: user.fullName,
      customer_address: 'Dhaka',
      customer_phone: user.phone,
      customer_city: 'Dhaka',
      customer_email: email,
    };
    try {
      const response = await axios.post(
        `${this.surjoBaseUrl}/api/secret-pay`,
        {
          prefix: this.surjoPrefix,
          store_id: store_id,
          token: token,
          return_url: `${process.env.BASE_CALLBACKURL}deposit/surjo/success/${email}/${amount}`, // Dynamic return URL
          cancel_url: `${process.env.BASE_CALLBACKURL}payment/cancel`,
          order_id: tran_id,
          client_ip: '192.67.2',
          ...data,
        },
        {
          headers: {
            authorization: `${token_type} ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return { surjoPay: response.data.checkout_url }; // Payment response
    } catch (error) {
      console.error(
        'Error making payment:',
        error.response ? error.response.data : error.message,
      );
      return 'Payment Failed';
    }
  }
  async surjoVerifyPayment(sp_order_id: string, email: string, amount: number) {
    const tokenDetails = await this.paymentService.surjoAuthentication();
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
      if (data.sp_message === 'Success') {
        const user = await this.userRepository.findOne({
          where: { email: email },
        });

        let addTransection: Transection = new Transection();
        addTransection.tranId = data.customer_order_id;
        addTransection.tranDate = data.date_time;
        addTransection.paidAmount = String(amount);
        addTransection.offerAmmount = data.received_amount;
        addTransection.bankTranId = data.bank_trx_id;
        addTransection.riskTitle = 'safe';
        addTransection.cardType = 'Surjo-Pay';
        addTransection.cardIssuer = `${data.method}-InternetBanking`;
        addTransection.cardBrand = data.method;
        addTransection.cardIssuerCountry = 'BD';
        addTransection.validationDate = data.date_time;
        addTransection.status = 'Deposited';
        const findUser = await this.userRepository.findOne({
          where: { email: email },
          relations: ['wallet'],
        });
        addTransection.walletBalance = findUser.wallet.ammount + Number(amount);
        findUser.wallet.ammount = findUser.wallet.ammount + Number(amount);
        addTransection.paymentType = 'Instaint Payment ';
        addTransection.requestType = `Instaint Money added `;
        addTransection.user = user;

        await this.walletRepository.save(findUser.wallet);
        await this.transectionRepository.save(addTransection);
        let addDeposit: Deposit = new Deposit();
        addDeposit.user = user;
        addDeposit.ammount = amount; // Must be changed
        addDeposit.depositId = data.customer_order_id;
        addDeposit.depositedFrom = data.method;
        addDeposit.senderName = user.fullName;
        addDeposit.createdAt = moment
          .utc(data.date_time)
          .format('YYYY-MM-DD HH:mm:ss');
        addDeposit.actionAt = moment
          .utc(data.date_time)
          .format('YYYY-MM-DD HH:mm:ss');
        addDeposit.status = 'Instant Deposit';
        addDeposit.depositType = 'MOBILEBANKING';

        await this.depositRepository.save(addDeposit);
        return data;
      } else {
        throw new Error('Payment validation failed. Invalid status.');
      }
    } catch (error) {
      console.error(
        'Error verifying payment:',
        error.response ? error.response.data : error.message,
      );
      return 'Payment Verification Failed';
    }
  }
  async createPaymentBkash(amount: number, header: any) {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `FSD${timestamp}${randomNumber}`;
    const email = await this.authService.decodeToken(header);
    try {
      const paymentDetails = {
        amount: amount || 10,
        callbackURL: `${process.env.BASE_CALLBACKURL}deposit/bkash/callback/${email}/${amount}`,
        orderID: tran_id || 'Order_101',
        reference: `${email}`,
      };

      const result = await createPayment(this.bkashConfig, paymentDetails);
      return { bkash: result.bkashURL };
    } catch (e) {
      console.log(e);
    }
  }
  async executePaymentBkash(
    paymentID: string,
    status: string,
    amount: number,
    res: any,
    email: string,
  ) {
    console.log(paymentID,status,amount,res,email)
    try {
      if (status === 'success') {
        const response: any = await executePayment(this.bkashConfig, paymentID);
        if (
          response?.transactionStatus === 'Completed' &&
          response?.statusMessage === 'Successful'
        ) {
          const user = await this.userRepository.findOne({
            where: { email: email },
          });
          const tranDate = response.paymentExecuteTime
            .split(' GMT')[0]
            .replace('T', ' ');
          const airTicketPrice = amount;
          const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.0125); // !Important some check the validation before adding the ammont. 2.5% charge added in sslcomerz
          const store_amount = Math.ceil(airTicketPrice - paymentGatwayCharge);
          let addTransection: Transection = new Transection();
          addTransection.tranId = response.merchantInvoiceNumber;
          addTransection.tranDate = tranDate;
          addTransection.paidAmount = String(amount);
          addTransection.offerAmmount = String(Math.floor(store_amount));
          addTransection.bankTranId = response.paymentID;
          addTransection.riskTitle = 'Safe';
          addTransection.cardType = 'Bkash';
          addTransection.cardIssuer = 'Bkash';
          addTransection.cardBrand = response.payerAccount;
          addTransection.cardIssuerCountry = 'BD';
          addTransection.validationDate = tranDate;
          addTransection.status = 'Deposited';
          const findUser = await this.userRepository.findOne({
            where: { email: email },
            relations: ['wallet'],
          });

          addTransection.walletBalance =
            findUser.wallet.ammount + Math.floor(store_amount);
          findUser.wallet.ammount =
            findUser.wallet.ammount + Math.floor(store_amount);
          addTransection.paymentType = 'Instaint Payment ';
          addTransection.requestType = `Instaint Money added `;
          addTransection.user = user;
          await this.walletRepository.save(findUser.wallet);
          await this.transectionRepository.save(addTransection);
          let addDeposit: Deposit = new Deposit();
          addDeposit.user = user;
          addDeposit.ammount = Math.floor(store_amount);
          addDeposit.depositId = response.merchantInvoiceNumber;
          addDeposit.depositedFrom = response.payerAccount;
          addDeposit.senderName = user.fullName;
          addDeposit.createdAt = moment
            .utc(tranDate)
            .format('YYYY-MM-DD HH:mm:ss');
          addDeposit.actionAt = moment
            .utc(tranDate)
            .format('YYYY-MM-DD HH:mm:ss');
          addDeposit.status = 'Instant Deposit';
          addDeposit.depositType = 'Bkash-MoneyAdd';
          await this.depositRepository.save(addDeposit);
        }
        return res.redirect(process.env.BASE_FRONT_CALLBACK_URL);
      } else {
        console.log('Payment not successful, skipping execution.');
        return null;
      }
    } catch (e) {
      console.error('Error executing payment:', e);
      throw new Error('Payment execution failed');
    }
  }
}
