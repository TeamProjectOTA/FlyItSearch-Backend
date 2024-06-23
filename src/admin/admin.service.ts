import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agents)
    private readonly agentRepository: Repository<Agents>,
    private readonly authservice: AuthService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
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
    return await this.adminRepository.find();
  }

  async findOne(header: any, adminId: string) {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    let findAdmin = await this.adminRepository.findOne({
      where: { adminid: adminId },
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

  async update(header: any, updateAdminDto: UpdateAdminDto) {
    const verifyAdmin = await this.authservice.verifyAdminToken(header);
    if (!verifyAdmin) {
      throw new UnauthorizedException();
    }
    const uuid= await this.authservice.decodeToken(header)
    const updateAdmin = await this.adminRepository.findOne({
      where: { uuid:uuid  },
    });
    if (!updateAdmin) {
      throw new NotFoundException();
    }
    if (updateAdminDto.email !== updateAdmin.email) {
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
    console.log(uuid)
    return await this.adminRepository.save(updateAdmin);
  }

  async remove(header: any, adminId: string): Promise<any> {
    const verifyAdminId = await this.authservice.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }
    const adminToFind = await this.adminRepository.findOne({
      where: { adminid: adminId },
    });
    const adminToDelete = await this.adminRepository.delete({
      adminid: adminId,
    }); //This is the solution for  truncation

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
}
