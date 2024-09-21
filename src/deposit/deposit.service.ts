import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Deposit, Wallet } from './deposit.model';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Transection } from 'src/transection/transection.model';

@Injectable()
export class DepositService {
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
  ) {}

  async createDeposit(
    depositData: Partial<Deposit>,
    header: any,
  ): Promise<Deposit> {
    const email = await this.authService.decodeToken(header);
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const random_id = `SSMD${timestamp}${randomNumber}`;
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    const deposit = this.depositRepository.create({
      ...depositData,
      depositId: random_id,
      createdAt: dhakaTimeFormatted,
      status: 'Pending',
      user,
    });

    return await this.depositRepository.save(deposit);
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
    deposit.rejectionReason = updateData.rejectionReason;
    // if(!deposit.rejectionReason&&){
    //     throw new NotFoundException('Rejection Reason Cannot be empty')
    // }
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
      findUser.wallet.ammount = findUser.wallet.ammount + deposit.ammount;
      await this.walletRepository.save(findUser.wallet);
      addTransection.walletBalance=findUser.wallet.ammount+deposit.ammount
      addTransection.paymentType='Money added'
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
}
