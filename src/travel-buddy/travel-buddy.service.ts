import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelBuddy, TravelBuddyDto } from './travel-buddy.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TravelBuddyService {
  constructor(
    @InjectRepository(TravelBuddy)
    private readonly travelBuddyRepository: Repository<TravelBuddy>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authservice: AuthService,
  ) {}

  async createTravelBuddy(
    createTravelBuddyDto: TravelBuddyDto,
    header: any,
  ): Promise<any> {
    const email = await this.authservice.decodeToken(header);

    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('No Booking data available for the user');
    }
    let saveTravelBuddy = await this.travelBuddyRepository.findOne({
      where: { passport: createTravelBuddyDto.passport, user },
    });

    if (saveTravelBuddy) {
      throw new ConflictException('Please enter a new passport number');
    } else {
      saveTravelBuddy = this.travelBuddyRepository.create({
        ...createTravelBuddyDto,
        user,
      });
    }
    const savedata=await this.travelBuddyRepository.save(saveTravelBuddy);
    return {
      Title:savedata.title,
      Name:savedata.firstName+` `+savedata.lastName,
      Gender:savedata.gender,
      Nationality:savedata.nationality,
      PassportNumber:savedata.passport,
      DateOfBirth:savedata.dob,
      PassportExpiry:savedata.passportexp 
    }
  }
  async updateTravelBuddy(
    createTravelBuddyDto: TravelBuddyDto,
    id: number,
  ): Promise<any> {
    const travelBuddy = await this.travelBuddyRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    travelBuddy.firstName = createTravelBuddyDto.firstName;
    travelBuddy.lastName = createTravelBuddyDto.lastName;
    travelBuddy.gender = createTravelBuddyDto.gender;
    travelBuddy.title = createTravelBuddyDto.title;
    travelBuddy.dob = createTravelBuddyDto.dob;
    travelBuddy.nationality = travelBuddy.nationality;
    travelBuddy.passport = travelBuddy.passport;
    travelBuddy.passportexp = travelBuddy.passportexp;
    return await this.travelBuddyRepository.save(travelBuddy);
  }

  async deleteTravelBuddy(id: number) {
    const travelBuddy = await this.travelBuddyRepository.findOne({
      where: { id: id },
    });
    if (!travelBuddy) {
      throw new NotFoundException('');
    }
    await this.travelBuddyRepository.delete(id);
    return {
      message: `The traveler named ${travelBuddy.firstName} ${travelBuddy.lastName} with this ${travelBuddy.passport} passport number was deleted successfully`,
    };
  }
}
