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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authservice: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    let add: User = new User();

    //find the database for the email address extence
    const userAlreadyExisted = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userAlreadyExisted) {
      throw new HttpException('User already existed', HttpStatus.BAD_REQUEST);
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
    add.passengerId = passengerId;
    add.fullName = createUserDto.fullName.toUpperCase();
    add.phone = createUserDto.phone;
    add.email = createUserDto.email;
    add.role = 'registered';
    add.password = hashedPassword;

    return this.userRepository.save(add);
  }

  async update(header: any, updateUserDto: UpdateUserDto) {
    // const verifyAdminToken = await this.authservice.verifyUserToken(header);
    const verifyUserToken = await this.authservice.verifyUserToken(header);
    if (!verifyUserToken) {
      throw new UnauthorizedException();
    }
    const email = await this.authservice.decodeToken(header);
    const updateUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!updateUser) {
      throw new NotFoundException();
    }
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUser.password = hashedPassword;
    }
    if (updateUserDto.email) {
      const findEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (findEmail) {
        throw new ConflictException('Email already existed');
      }
    }
    updateUser.fullName = updateUserDto.fullName;
    updateUser.email = updateUserDto.email;
    return await this.userRepository.save(updateUser);
  }

  async allUser(header: any): Promise<User[]> {
    const verifyUser = await this.authservice.verifyUserToken(header);
    // const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }
    return await this.userRepository.find();
  }
  async findUserWithBookings(header: any): Promise<User> {
    const email = await this.authservice.decodeToken(header);
    const updateUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!updateUser) {
      throw new NotFoundException('No Booking data Avilable for the user');
    }
    return this.userRepository.findOne({
      where: { email },
      relations: ['saveBookings','saveBookings.laginfo'],
    });
  }
  async findAllUserWithBookings(): Promise<any> {
    return this.userRepository.find({
      relations: ['saveBookings','saveBookings.laginfo'],
    });
  }
}
