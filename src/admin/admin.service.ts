import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { Agents } from 'src/agents/entities/agents.entity';
import { BookingSave } from 'src/book/booking.model';
import { Transection } from 'src/transection/transection.model';
import { Wallet } from 'src/deposit/deposit.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agents)
    private readonly agentRepository: Repository<Agents>,
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(Transection)
    private readonly transectionRepository: Repository<Transection>,
    private readonly authservice: AuthService,
  ) {}

  async create(createAdminDto: CreateAdminDto, header: any): Promise<Admin> {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    const email = await this.authservice.decodeToken(header);
    const adminFind = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (adminFind.role != 'superAdmin') {
      throw new UnauthorizedException(
        `You are not permitted to create an admin account ${adminFind.firstName} ${adminFind.lastName}`,
      );
    }
    const adminAllReadyExisted = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    if (adminAllReadyExisted) {
      throw new HttpException('Admin already existed', HttpStatus.BAD_REQUEST);
    }
    let add: Admin = new Admin();
    const admin = await this.adminRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    let adminId: string;
    if (admin.length === 1) {
      const lastAdmin = admin[0];
      const oldAdminId = lastAdmin.adminid.replace('FLYIT', '');
      adminId = 'FLYIT' + (parseInt(oldAdminId) + 1);
    } else {
      adminId = 'FLYIT1000';
    }

    add.adminid = adminId;
    add.firstName = createAdminDto.firstName;
    add.lastName = createAdminDto.lastName;
    add.email = createAdminDto.email;
    add.phone = createAdminDto.phone;
    add.password = createAdminDto.password;
    add.role = createAdminDto.role;
    add.status = createAdminDto.status;
    add.created_at = new Date();
    add.updated_at = new Date();
    add.uuid = uuidv4();
    return await this.adminRepository.save(add);
  }

  async findAll(header: any) {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    const email = await this.authservice.decodeToken(header);
    const adminFind = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (adminFind.role != 'superAdmin') {
      throw new UnauthorizedException(
        `You are not permitted to create an admin account ${adminFind.firstName} ${adminFind.lastName}`,
      );
    }
    return await this.adminRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(header: any, uuid: string) {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    let findAdmin = await this.adminRepository.findOne({
      where: { uuid: uuid },
    });
    if (!findAdmin) {
      throw new NotFoundException();
    }
    return findAdmin;
  }

  async findOneUser(passengerId: string, header: any) {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }

    const finduser = await this.userRepository.findOne({
      where: { passengerId: passengerId },
    });
    if (!finduser) {
      throw new NotFoundException();
    }
    return finduser;
  }

  async update(header: any, updateAdminDto: UpdateAdminDto, uuid: any) {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }

    const updateAdmin = await this.adminRepository.findOne({
      where: { uuid: uuid },
    });

    if (!updateAdmin) {
      throw new NotFoundException();
    }
    if (updateAdminDto.email && updateAdminDto.email !== updateAdmin.email) {
      const emailExisted = await this.adminRepository.findOne({
        where: { email: updateAdminDto.email },
      });
      if (emailExisted) {
        throw new BadRequestException(
          'Email already exists. Please enter another email.',
        );
      }
    }
    updateAdmin.firstName = updateAdminDto.firstName;
    updateAdmin.lastName = updateAdminDto.lastName;
    updateAdmin.email = updateAdminDto.email;
    updateAdmin.phone = updateAdminDto.phone;
    updateAdmin.password = updateAdminDto.password;
    updateAdmin.status = updateAdminDto.status;
    updateAdmin.updated_at = new Date();

    return await this.adminRepository.save(updateAdmin);
  }

  async remove(header: any, uuid: string): Promise<any> {
    const verifyAdminId = await this.authservice.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }
    const decodedToken = await this.authservice.decodeToken(header);
    if (uuid == decodedToken) {
      throw new UnauthorizedException('You can not delete your self');
    }
    const adminToFind = await this.adminRepository.findOne({
      where: { uuid: uuid },
    });

    const adminToDelete = await this.adminRepository.delete({
      uuid: uuid,
    });
    return { adminToFind, adminToDelete };
  }

  async removeUser(passengerId: string, header: any) {
    const verifyAdminId = await this.authservice.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }
    const userToFind = await this.userRepository.findOne({
      where: { passengerId: passengerId },
    });
    const userToDelete = await this.userRepository.delete({
      passengerId: passengerId,
    });
    return { userToFind, userToDelete };
  }

  async allbooking() {
    return await this.bookingSaveRepository.find();
  }

  async ticketCancel(bookingId: string, reason: string, header: any) {
    const email = await this.authservice.decodeToken(header);
    const admin = await this.adminRepository.findOne({
      where: { email: email },
    });
    const booking = await this.bookingSaveRepository.findOne({
      where: { bookingId: bookingId },
      relations: ['user'],
    });
    const wallet = await this.userRepository.findOne({
      where: { email: booking.user.email },
      relations: ['wallet'],
    });
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
    add.bookingId = bookingId;
    add.user = wallet;
    add.paymentType = 'FlyIt Wallet';
    add.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
    add.currierName = booking.Curriername;
    add.validationDate = dhakaTimeFormatted;
    add.tranDate = dhakaTimeFormatted;
    add.paidAmount =Number( booking.netAmmount);
    add.offerAmmount =Number( booking.netAmmount);
    add.riskTitle = 'Safe';
    add.cardType = 'Adjusted Money Added';
    add.status = 'Adjusted';
    add.walletBalance = wallet.wallet.ammount + Number(booking.netAmmount);
    wallet.wallet.ammount = wallet.wallet.ammount + Number(booking.netAmmount);
    booking.bookingStatus = 'Cancelled';
    booking.reason = reason;
    booking.actionBy = `${admin.firstName} ${admin.lastName}`;
    booking.actionAt = dhakaTimeFormatted;
    await this.userRepository.save(wallet);
    await this.bookingSaveRepository.save(booking);
    return await this.transectionRepository.save(add);
  }
}
