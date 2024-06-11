import {
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
    add.role=createUserDto.role;
    add.password = hashedPassword;

    return this.userRepository.save(add);
  }

  async update(passengerId: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userRepository.findOne({
      where: { passengerId: passengerId },
    });
    if (!updateUser) {
      throw new NotFoundException();
    }
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    updateUser.fullName = updateUserDto.fullName;
    updateUser.email = updateUserDto.email;
    updateUser.password = hashedPassword;

    return await this.userRepository.save(updateUser);
  }

  async allUser(header: any): Promise<User[]> {
    const verifyAdminToken = await this.authservice.verifyUserToken(header);
    if (!verifyAdminToken) {
      throw new UnauthorizedException();
    }
    return await this.userRepository.find();
  }
}
