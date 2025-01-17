import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcryptjs';
import { Wallet } from 'src/deposit/deposit.model';
import { Transection } from 'src/transection/transection.model';
import { IpAddress } from 'src/ip/ip.model';
import { BookingSave } from 'src/book/booking.model';
import { TravelBuddy } from 'src/travel-buddy/travel-buddy.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transection)
    private readonly transectionRepository: Repository<Transection>,
    private readonly authservice: AuthService,
    @InjectRepository(IpAddress)
    private readonly ipAddressRepository: Repository<IpAddress>,
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(TravelBuddy)
    private readonly travelBuddyRepository: Repository<TravelBuddy>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    let add: User = new User();

    const userAlreadyExisted = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      relations: ['wallet'],
    });

    if (userAlreadyExisted) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const passenger = await this.userRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    let passengerId: string;
    if (passenger.length === 1) {
      const lastPassenger = passenger[0];
      const oldpassengerId = lastPassenger.passengerId.replace('FLYITP', '');
      passengerId = 'FLYITP' + (parseInt(oldpassengerId) + 1);
    } else {
      passengerId = 'FLYITP1000';
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    add.passengerId = passengerId;
    add.fullName = createUserDto.fullName.toUpperCase();
    add.phone = createUserDto.phone;
    add.email = createUserDto.email;
    add.role = 'registered';
    add.status = 'ACTIVE';
    add.password = hashedPassword;
    add.verificationToken = verificationToken;
    const newWallet = new Wallet();
    newWallet.ammount = 0;
    add.wallet = newWallet;
    const user = await this.userRepository.save(add);
    await this.authservice.sendVerificationEmail(user.email, verificationToken);

    return {
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      message: `Please verify your email. An varification mail code has been sent to ${user.email}`,
    };
  }

  async update(header: any, updateUserDto: UpdateUserDto) {
    const verifyUserToken = await this.authservice.verifyUserToken(header);
    if (!verifyUserToken) {
      throw new UnauthorizedException();
    }

    const email = await this.authservice.decodeToken(header);
    const updateUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!updateUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== updateUser.email) {
      const findEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (findEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(updateUser, {
      fullName: updateUserDto?.fullName?.toUpperCase() || updateUser.fullName,
      phone: updateUserDto?.phone || updateUser.phone,
      email: updateUserDto?.email || updateUser.email,
      dob: updateUserDto?.dob || updateUser.dob,
      nationility: updateUserDto?.nationility || updateUser.nationility,
      password: updateUserDto?.password || updateUser.password,
      gender: updateUserDto?.gender || updateUser.gender,
      passport: updateUserDto?.passport || updateUser.passport,
      passportexp: updateUserDto?.passportexp || updateUser.passportexp,
    });

    const isEmailUpdated =
      updateUserDto?.email && updateUserDto.email !== email;
    if (isEmailUpdated) {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      updateUser.verificationToken = verificationToken;
      updateUser.emailVerified = false;
      await this.authservice.sendVerificationEmail(
        updateUser.email,
        verificationToken,
      );
    }
    await this.userRepository.save(updateUser);
    const userResponse = {
      id: updateUser.id,
      fullName: updateUser.fullName,
      email: updateUser.email,
      phone: updateUser.phone,
      dob: updateUser.dob,
      nationility: updateUser.nationility,
      gender: updateUser.gender,
      passport: updateUser.passport,
      passportexp: updateUser.passportexp,
    };
    return userResponse;
  }

  async allUser(
    header: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    // Pagination Complete
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const offset = (pageNumber - 1) * limitNumber;
    const [users, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limitNumber,
      order: { id: 'DESC' },
    });
    return {
      data: users,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  async findUserWithBookings(
    header: any,
    bookingStatus: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const pageNumber = Math.max(1, page);
    const limitNumber = limit > 0 ? limit : 10;
    const offset = (pageNumber - 1) * limitNumber;

    const verifyUser = await this.authservice.verifyUserToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }

    const email = await this.authservice.decodeToken(header);

    const [bookings, total] = await this.bookingSaveRepository
      .createQueryBuilder('bookingSave')
      .innerJoin('bookingSave.user', 'user')
      .where('user.email = :email', { email })
      .andWhere('LOWER(bookingSave.bookingStatus) = LOWER(:bookingStatus)', {
        bookingStatus,
      })
      .orderBy('bookingSave.id', 'DESC')
      .skip(offset)
      .take(limitNumber)
      .getManyAndCount();

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(`No ${bookingStatus} available for the user`);
    }

    const filteredBookings = bookings.map((booking) => ({
      id: booking.id,
      system: booking.system,
      bookingId: booking.bookingId,
      paxCount: booking.paxCount,
      Curriername: booking.Curriername,
      CurrierCode: booking.CurrierCode,
      flightNumber: booking.flightNumber,
      isRefundable: booking.isRefundable,
      bookingDate: booking.bookingDate,
      expireDate: booking.expireDate,
      bookingStatus: booking.bookingStatus,
      TripType: booking.TripType,
      grossAmmount: booking.grossAmmount,
      netAmmount: booking.netAmmount,
      laginfo: booking.laginfo,
      personId: booking.personId,
    }));

    return {
      bookings: filteredBookings,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  async findAllUserWithBookings(page: number, limit: number): Promise<any> {
    //Pagination Complete

    const offset = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      relations: ['bookingSave', 'wallet'],
      order: {
        passengerId: 'DESC',
      },
      take: limit,
      skip: offset,
    });

    const usersWithIpData = await Promise.all(
      users.map(async (user) => {
        const emaildata = user.email;
        const ip = await this.ipAddressRepository.findOne({
          where: { email: emaildata },
        });
        const searchCount = 50 - (ip?.points || 0);

        return {
          ...user,
          searchCount,
        };
      }),
    );

    return {
      data: usersWithIpData,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneUser(header: any): Promise<any> {
    const email = await this.authservice.decodeToken(header);
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['profilePicture', 'wallet'],
    });

    const nameParts = user.fullName.split(' ');

    let firstName = '';
    let lastName = '';

    if (nameParts.length > 0) {
      firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
    }
    if (nameParts.length > 1) {
      lastName =
        nameParts.slice(1).join(' ').charAt(0).toUpperCase() +
        nameParts.slice(1).join(' ').slice(1);
    }

    return {
      firstName: firstName,
      lastName: lastName,
      gender: user.gender,
      dob: user.dob,
      nationality: user.nationility,
      passport: user.passport,
      passportExpiryDate: user.passportexp,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      wallet: user.wallet,
    };
  }

  async findUserTravelBuddy(
    header: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const verifyUser = await this.authservice.verifyUserToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const offset = (pageNumber - 1) * limitNumber;
    const email = await this.authservice.decodeToken(header);
    const [travelBuddies, total] = await this.travelBuddyRepository
      .createQueryBuilder('travelbuddy')
      .innerJoin('travelbuddy.user', 'user')
      .where('user.email = :email', { email })
      .orderBy('travelbuddy.id', 'DESC')
      .skip(offset)
      .take(limitNumber)
      .getManyAndCount();
    if (!travelBuddies || travelBuddies.length === 0) {
      throw new NotFoundException(`No Travel Buddies available for the user`);
    }
    travelBuddies.forEach((buddy) => {
      delete buddy.id;
    });

    return {
      travelBuddies,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  async findUserTransactions(
    header: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const email = await this.authservice.decodeToken(header);
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const offset = (pageNumber - 1) * limitNumber;
    const [transactions, total] = await this.transectionRepository
      .createQueryBuilder('transection')
      .innerJoin('transection.user', 'user')
      .where('user.email = :email', { email })
      .orderBy('transection.id', 'DESC')
      .skip(offset)
      .take(limitNumber)
      .select([
        'transection.id',
        'transection.tranId',
        'transection.tranDate',
        'transection.bookingId',
        'transection.offerAmmount',
        'transection.status',
        'transection.requestType',
        'transection.paymentType',
        'transection.refundAmount',
      ])
      .getManyAndCount();

    return {
      transactions,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  async allTransection(page: number = 1, limit: number = 10) {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const offset = (pageNumber - 1) * limitNumber;
    const [transection, total] = await this.transectionRepository.findAndCount({
      relations: ['user', 'user.wallet'],
      order: { id: 'DESC' },
      skip: offset,
      take: limitNumber,
    });
    return {
      transection,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  async updateUserActivation(email: string, action: string) {
    let user = await this.userRepository.findOne({ where: { email: email } });
    user.status = action;
    return await this.userRepository.save(user);
  }
}
