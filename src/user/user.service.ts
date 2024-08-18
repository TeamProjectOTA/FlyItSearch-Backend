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


  async create(createUserDto: CreateUserDto): Promise<any> {
    let add: User = new User();
  
    
    const userAlreadyExisted = await this.userRepository.findOne({
      where: { email: createUserDto.email },
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
  
    
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  
    
    add.passengerId = passengerId;
    add.fullName = createUserDto.fullName.toUpperCase();
    add.phone = createUserDto.phone;
    add.email = createUserDto.email;
    add.role = 'registered';
    add.password = hashedPassword;
    add.verificationToken = verificationToken;  
   
    const user = await this.userRepository.save(add);
  
    await this.authservice.sendVerificationEmail(user.email, verificationToken);
  
    return {
      fullName:user.fullName,
      phone:user.phone,
      email:user.email,
      message:`Please verify your email. An varification mail code has been sent to ${user.email}`      
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
    const isEmailUpdated = updateUserDto?.email && updateUserDto.email !== updateUser.email;

    let hashedPassword : string 
    if(updateUserDto?.password){
      hashedPassword = await bcrypt.hash(updateUserDto?.password, 10);
    
    }
    const password=hashedPassword ||updateUser.password

    Object.assign(updateUser, {
      fullName: updateUserDto?.fullName?.toUpperCase() || updateUser.fullName,
      phone:updateUserDto?.phone||updateUser.phone,
      email: updateUserDto?.email || updateUser.email,
      dob: updateUserDto?.dob || updateUser.dob,
      gender: updateUserDto?.gender || updateUser.gender,
      nationility: updateUserDto?.nationility || updateUser.nationility,
      passport: updateUserDto?.passport || updateUser.passport,
      password:password
    });
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    if (isEmailUpdated) {
      updateUser.verificationToken = verificationToken
      updateUser.emailVerified=false
      await this.authservice.sendVerificationEmail(updateUser.email, verificationToken)
    }
    return await this.userRepository.save(updateUser);
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

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bookingSave', 'bookingSave')
      .where('user.email = :email', { email })
      .andWhere('LOWER(bookingSave.bookingStatus) = LOWER(:bookingStatus)', {
        bookingStatus,
      })
      .orderBy('bookingSave.bookingDate', 'ASC')
      .getOne();

    if (!user) {
      throw new NotFoundException('No Booking data Available for the user');
    }
    return {
      saveBookings: user.bookingSave,
    };
  }

  async findAllUserWithBookings(header: any): Promise<any> {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    return this.userRepository.find({
      relations: ['saveBookings', 'saveBookings.laginfo'],
    });
  }

  async findOneUser(header:any):Promise<any>{
    const verifyUser = await this.authservice.verifyUserToken(header);
    if (!verifyUser) {
      throw new UnauthorizedException();
    }
    const email = await this.authservice.decodeToken(header);
    const user= await this.userRepository.findOne({where:{email:email},relations:['profilePicture']})
     
  const nameParts = user.fullName.split(' ');

  let firstName = '';
  let lastName = '';

  if (nameParts.length > 0) {
    firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
  }
  if (nameParts.length > 1) {
    lastName = nameParts.slice(1).join(' ').charAt(0).toUpperCase() + nameParts.slice(1).join(' ').slice(1);
  }

    

    return {
      firstName:firstName,
      lastName:lastName,
      gender:user.gender,
      dob:user.dob,
      nationality:user.nationility,
      passport:user.passport,
      passportExpiryDate:user.passportexp,
      email:user.email,
      phone:user.phone,
      profilePicture:user.profilePicture
    }

  }
}
