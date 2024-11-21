import {
  ConflictException,
  HttpException,
  HttpStatus,
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

  async allUser(header: any): Promise<User[]> {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    return await this.userRepository.find();
  }

  async findUserWithBookings(header: any, bookingStatus: string): Promise<any> {
    const verifyUser = await this.authservice.verifyUserToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }

    const email = await this.authservice.decodeToken(header);
    const userUpdate = await this.userRepository.findOne({
      where: { email: email },
      relations: ['bookingSave'],
    });

    if (!userUpdate) {
      throw new NotFoundException('User not found');
    }

    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // Offset for Dhaka time
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);

    // for (const booking of userUpdate.bookingSave) {
    //     const timeLeft = new Date(booking.expireDate);
    //     if (dhakaTime.getTime() >= timeLeft.getTime() && booking.bookingStatus !== 'Cancelled') {
    //         booking.bookingStatus = 'Cancelled';

    //         await this.userRepository.save(booking);
    //         console.log(`Booking ID ${booking.id} updated to Cancelled`);
    //     }
    // }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bookingSave', 'bookingSave')
      .where('user.email = :email', { email })
      .andWhere('LOWER(bookingSave.bookingStatus) = LOWER(:bookingStatus)', {
        bookingStatus,
      })
      .orderBy('bookingSave.id', 'DESC')
      .getOne();

    if (!user) {
      throw new NotFoundException(`No ${bookingStatus} Available for the user`);
    }

    return {
      saveBookings: user.bookingSave,
    };
  }

  async findAllUserWithBookings(): Promise<any> {
    const users = await this.userRepository.find({
      relations: ['bookingSave', 'wallet'],
      order: {
        passengerId: 'DESC',
      },
    });
    const usersWithIpData = await Promise.all(
      users.map(async (user) => {
        const emaildata = user.email;
        const ip = await this.ipAddressRepository.findOne({
          where: { email: emaildata },
        });
        const searchCount = 50 - ip?.points || 0;

        return {
          ...user,
          searchCount,
        };
      }),
    );

    return usersWithIpData;
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

  async findUserTravelBuddy(header: any): Promise<any> {
    const verifyUser = await this.authservice.verifyUserToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }
    const email = await this.authservice.decodeToken(header);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.travelBuddy', 'travelBuddy')
      .where('user.email = :email', { email })
      .orderBy('travelBuddy.id', 'DESC')
      .getOne();

    if (!user || user.travelBuddy.length === 0) {
      throw new NotFoundException(`No Travel Buddies available for the user`);
    }
    return {
      travelBuddies: user.travelBuddy,
    };
  }

  async findUserTransection(header: any) {
    const email = await this.authservice.decodeToken(header);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.transection', 'transection')
      .where('user.email = :email', { email })
      .orderBy('transection.id', 'DESC')
      .getOne();
    return { transection: user.transection };
  }
  async allTransection() {
    return await this.transectionRepository.find({
      relations: ['user', 'user.wallet'],
      order: { id: 'DESC' },
    });
  }

  async updateUserActivation(email: string, action: string) {
    let user = await this.userRepository.findOne({ where: { email: email } });
    user.status = action;
    return await this.userRepository.save(user);
  }
}
