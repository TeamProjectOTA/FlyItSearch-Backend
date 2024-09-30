import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
import { Repository } from 'typeorm';
import { CreateTransectionDto, Transection } from './transection.model';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/deposit/deposit.model';

@Injectable()
export class TransectionService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(BookingSave)
    private readonly bookingRepository: Repository<BookingSave>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transection)
    private readonly transectionRepoistory: Repository<Transection>,
  ) {}
  async paymentWithWallet(header: any, transectiondto: CreateTransectionDto) {
    const email = await this.authService.decodeToken(header);
    let wallet = await this.walletRepository
      .createQueryBuilder('wallet')
      .innerJoinAndSelect('wallet.user', 'user')
      .where('user.email = :email', { email })
      .getOne();
    const booking = await this.bookingRepository.findOne({
      where: { bookingId: transectiondto.bookingId },
      relations: ['user'], // Assuming 'user' is the relation in the Booking entity
    });

    if (!booking) {
      throw new NotFoundException(
        `No booking found with  this ${transectiondto.bookingId} id`,
      );
    }
    const isSameUser = booking.user.email === email;

    if (!isSameUser) {
      throw new Error('Booking does not belong to this user');
    }

    if (wallet.ammount < transectiondto.paidAmount) {
      throw new NotAcceptableException('Insufficient balance');
    }
    const user = await this.userRepository.findOne({ where: { email: email } });
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    const arrto = booking.laginfo[0].ArrTo;
    const depfrom = booking.laginfo[0].DepFrom;
    const tripType = booking.TripType;

    let add: Transection = new Transection();
    add.tranId = tran_id;
    add.bookingId = transectiondto.bookingId;
    add.user = user;
    add.paymentType = 'FlyIt Wallet';
    add.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
    add.currierName = transectiondto.currierName;
    add.validationDate = dhakaTimeFormatted;
    add.tranDate = dhakaTimeFormatted;
    add.paidAmount = transectiondto.paidAmount.toString();
    add.offerAmmount = transectiondto.offerAmmount;
    add.riskTitle = 'Safe';
    add.cardType = 'Deducted from Deposit';
    add.status = 'Purchase';
    add.currierName = transectiondto.currierName;
    add.walletBalance = wallet.ammount - transectiondto.paidAmount;
    wallet.ammount = add.walletBalance;
    booking.bookingStatus = 'IssueInProcess';
    booking.actionAt=dhakaTimeFormatted
    booking.actionBy=user.fullName
    await this.walletRepository.save(wallet);
    await this.bookingRepository.save(booking);
    return await this.transectionRepoistory.save(add);
  }
}
