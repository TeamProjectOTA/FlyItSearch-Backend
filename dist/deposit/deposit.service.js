"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const deposit_model_1 = require("./deposit.model");
const typeorm_2 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const transection_model_1 = require("../transection/transection.model");
const sslcommerz_1 = require("sslcommerz");
const storage_1 = require("@google-cloud/storage");
const payment_service_1 = require("../payment/payment.service");
const axios_1 = require("axios");
const bkash_payment_1 = require("bkash-payment");
let DepositService = class DepositService {
    constructor(depositRepository, userRepository, walletRepository, transectionRepository, authService, paymentService) {
        this.depositRepository = depositRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transectionRepository = transectionRepository;
        this.authService = authService;
        this.paymentService = paymentService;
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
        this.storage = new storage_1.Storage({
            keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
        });
        this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
    }
    async createDeposit(depositData, header, file) {
        const email = await this.authService.decodeToken(header);
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const random_id = `FSD${timestamp}${randomNumber}`;
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error saving deposit:', error.message);
            throw new common_1.InternalServerErrorException('Failed to save deposit');
        }
    }
    async getDepositforUser(header) {
        const email = await this.authService.decodeToken(header);
        const userWithDeposits = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.deposit', 'deposit')
            .where('user.email = :email', { email })
            .orderBy('deposit.id', 'DESC')
            .getOne();
        if (!userWithDeposits) {
            throw new common_1.NotFoundException('User not found');
        }
        return userWithDeposits.deposit;
    }
    async findAllDeposit() {
        return this.depositRepository.find({
            order: { id: 'DESC' },
            relations: ['user'],
        });
    }
    async updateDepositStatus(depositId, updateData) {
        const deposit = await this.depositRepository.findOne({
            where: { depositId: depositId },
            relations: ['user'],
        });
        const userEmail = deposit.user.email;
        if (!deposit) {
            throw new common_1.NotFoundException('Deposit not found');
        }
        if (deposit.actionAt) {
            throw new common_1.ConflictException(`The action was already taken at ${deposit.actionAt}`);
        }
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        deposit.status = updateData.status;
        deposit.actionAt = dhakaTimeFormatted;
        deposit.rejectionReason = updateData.rejectionReason;
        if (updateData.status == 'Approved') {
            let addTransection = new transection_model_1.Transection();
            addTransection.tranId = deposit.depositId;
            addTransection.user = deposit.user;
            addTransection.tranDate = moment
                .utc(deposit.createdAt)
                .format('YYYY-MM-DD HH:mm:ss');
            addTransection.requestType = `${deposit.depositType} Transfar`;
            addTransection.bankTranId = deposit.referance;
            addTransection.paidAmount = deposit.ammount;
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
    async wallet(header) {
        const email = await this.authService.decodeToken(header);
        const wallet = await this.userRepository.findOne({
            where: { email: email },
            relations: ['wallet'],
        });
        return wallet.wallet;
    }
    async sslcommerzPaymentInit(header, amount) {
        const sslcommerz = new sslcommerz_1.SslCommerzPayment(this.sslcommerzsslcommerzStoreId, this.sslcommerzStorePwd, this.isLive);
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
    async validateOrder(val_id, email, amount) {
        const sslcommerz = new sslcommerz_1.SslCommerzPayment(this.sslcommerzsslcommerzStoreId, this.sslcommerzStorePwd, this.isLive);
        const validationData = {
            val_id: val_id,
        };
        try {
            const response = await sslcommerz.validate(validationData);
            if (response?.status === 'VALID') {
                const user = await this.userRepository.findOne({
                    where: { email: email },
                });
                let addTransection = new transection_model_1.Transection();
                addTransection.tranId = response.tran_id;
                addTransection.tranDate = response.tran_date;
                addTransection.paidAmount = amount;
                addTransection.offerAmmount = Math.floor(response.store_amount);
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
                let addDeposit = new deposit_model_1.Deposit();
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
                addDeposit.status = 'Approved';
                addDeposit.depositType = response?.card_brand;
                await this.depositRepository.save(addDeposit);
                return response;
            }
            else {
                throw new Error('Payment validation failed. Invalid status.');
            }
        }
        catch (error) {
            console.error('Error validating payment:', error);
            throw new Error('Error occurred during payment validation.');
        }
    }
    async surjoPayInit(header, amount, userIp) {
        const email = await this.authService.decodeToken(header);
        const user = await this.userRepository.findOne({ where: { email: email } });
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const tokenDetails = await this.paymentService.surjoAuthentication();
        const { token, token_type, store_id } = tokenDetails;
        const tran_id = `FSD${timestamp}${randomNumber}`;
        const url = `${this.surjoBaseUrl}/api/secret-pay`;
        const data = {
            prefix: this.surjoPrefix,
            store_id: store_id,
            token: token,
            return_url: `${process.env.BASE_CALLBACKURL}surjo/success/${email}`,
            cancel_url: `${process.env.BASE_CALLBACKURL}payment/cancel`,
            order_id: tran_id,
            client_ip: userIp,
            amount: amount,
            currency: 'BDT',
            customer_name: user.fullName,
            customer_address: 'Not',
            customer_phone: user.phone,
            customer_city: 'Applicable',
            customer_email: email,
        };
        const requestOptions = {
            headers: {
                authorization: `${token_type} ${token}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios_1.default.post(url, data, requestOptions);
            return { surjoPay: response.data.checkout_url };
        }
        catch (error) {
            console.error('Error making payment:', error.response ? error.response.data : error.message);
            return 'Payment Failed';
        }
    }
    async surjoVerifyPayment(sp_order_id, email, res) {
        const tokenDetails = await this.paymentService.surjoAuthentication();
        const { token, token_type } = tokenDetails;
        try {
            const response = await axios_1.default.post(`${this.surjoBaseUrl}/api/verification`, {
                order_id: sp_order_id,
            }, {
                headers: {
                    authorization: `${token_type} ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data[0];
            if (data.sp_code === '1000') {
                const user = await this.userRepository.findOne({
                    where: { email: email },
                });
                let addTransection = new transection_model_1.Transection();
                addTransection.tranId = data.customer_order_id;
                addTransection.tranDate = data.date_time;
                addTransection.paidAmount = Number(data.amount);
                addTransection.offerAmmount = Number(data.amount);
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
                addTransection.walletBalance =
                    findUser.wallet.ammount + Number(data.amount);
                findUser.wallet.ammount = findUser.wallet.ammount + Number(data.amount);
                addTransection.paymentType = 'Instaint Payment ';
                addTransection.requestType = `Instaint Money added `;
                addTransection.user = user;
                await this.walletRepository.save(findUser.wallet);
                await this.transectionRepository.save(addTransection);
                let addDeposit = new deposit_model_1.Deposit();
                addDeposit.user = user;
                addDeposit.ammount = isNaN(Number(data.amount.trim()))
                    ? 0
                    : Number(data.amount.trim());
                addDeposit.depositId = data.customer_order_id;
                addDeposit.depositedFrom = data.method;
                addDeposit.senderName = user.fullName;
                addDeposit.createdAt = moment
                    .utc(data.date_time)
                    .format('YYYY-MM-DD HH:mm:ss');
                addDeposit.actionAt = moment
                    .utc(data.date_time)
                    .format('YYYY-MM-DD HH:mm:ss');
                addDeposit.status = 'Approved';
                addDeposit.depositType = 'MOBILEBANKING';
                await this.depositRepository.save(addDeposit);
                return res.redirect(process.env.SUCCESS_CALLBACK);
            }
            else {
                return res.redirect(process.env.FAILED_BKASH_CALLBACK);
            }
        }
        catch (error) {
            console.error('Error verifying payment:', error.response ? error.response.data : error.message);
            return res.redirect(process.env.FAILED_BKASH_CALLBACK);
        }
    }
    async createPaymentBkash(amount, header) {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const tran_id = `FSD${timestamp}${randomNumber}`;
        const email = await this.authService.decodeToken(header);
        const airTicketPrice = amount;
        const paymentGatewayCharge = airTicketPrice * 0.0125;
        const storeAmount = airTicketPrice + paymentGatewayCharge;
        const roundedAmount = storeAmount.toFixed(2);
        try {
            const paymentDetails = {
                amount: roundedAmount || 10,
                callbackURL: `${process.env.BASE_CALLBACKURL}deposit/bkash/callback/${amount}`,
                orderID: tran_id || 'Order_101',
                reference: `${email}`,
            };
            const result = await (0, bkash_payment_1.createPayment)(this.bkashConfig, paymentDetails);
            return { bkash: result.bkashURL };
        }
        catch (e) {
            console.log(e);
        }
    }
    async executePaymentBkash(paymentID, status, res, offerAmmount) {
        try {
            if (status === 'success') {
                const response = await (0, bkash_payment_1.executePayment)(this.bkashConfig, paymentID);
                if (response?.transactionStatus === 'Completed' &&
                    response?.statusMessage === 'Successful') {
                    const email = response.payerReference;
                    const user = await this.userRepository.findOne({
                        where: { email: email },
                        relations: ['wallet'],
                    });
                    if (!user || !user.wallet) {
                        throw new Error('User or wallet not found');
                    }
                    const tranDate = response?.paymentExecuteTime
                        .split(' GMT')[0]
                        .replace('T', ' ');
                    const amount = response.amount;
                    let addTransaction = new transection_model_1.Transection();
                    addTransaction.tranId = response.merchantInvoiceNumber;
                    addTransaction.tranDate = tranDate;
                    addTransaction.paidAmount = amount;
                    addTransaction.offerAmmount = offerAmmount;
                    addTransaction.bankTranId = response?.trxID;
                    addTransaction.paymentId = paymentID;
                    addTransaction.riskTitle = 'Safe';
                    addTransaction.cardType = 'Bkash';
                    addTransaction.cardIssuer = 'Bkash';
                    addTransaction.cardBrand = response?.payerAccount;
                    addTransaction.cardIssuerCountry = 'BD';
                    addTransaction.validationDate = tranDate;
                    addTransaction.status = 'Deposited';
                    addTransaction.walletBalance =
                        user.wallet.ammount + Number(offerAmmount);
                    addTransaction.paymentType = 'Instant Payment';
                    addTransaction.requestType = 'Instant Money added';
                    addTransaction.user = user;
                    user.wallet.ammount = user.wallet.ammount + Number(offerAmmount);
                    await this.walletRepository.save(user.wallet);
                    await this.transectionRepository.save(addTransaction);
                    let addDeposit = new deposit_model_1.Deposit();
                    addDeposit.user = user;
                    addDeposit.ammount = offerAmmount;
                    addDeposit.depositId = response?.merchantInvoiceNumber;
                    addDeposit.depositedFrom = response?.payerAccount;
                    addDeposit.senderName = user.fullName;
                    const tranDateObject = new Date(tranDate);
                    addDeposit.createdAt = tranDateObject
                        .toISOString()
                        .split('T')
                        .join(' ')
                        .slice(0, 19);
                    addDeposit.actionAt = tranDateObject
                        .toISOString()
                        .split('T')
                        .join(' ')
                        .slice(0, 19);
                    addDeposit.status = 'Approved';
                    addDeposit.depositType = 'Bkash-MoneyAdd';
                    await this.depositRepository.save(addDeposit);
                    return res.redirect(process.env.SUCCESS_CALLBACK);
                }
                else {
                    return res.redirect(process.env.FAILED_BKASH_CALLBACK);
                }
            }
            else {
                return res.redirect(process.env.FAIELD_CALLBACK);
            }
        }
        catch (e) {
            console.error('Error executing payment:', e);
            throw new Error('Payment execution failed');
        }
    }
};
exports.DepositService = DepositService;
exports.DepositService = DepositService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(deposit_model_1.Deposit)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(deposit_model_1.Wallet)),
    __param(3, (0, typeorm_2.InjectRepository)(transection_model_1.Transection)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        auth_service_1.AuthService,
        payment_service_1.PaymentService])
], DepositService);
//# sourceMappingURL=deposit.service.js.map