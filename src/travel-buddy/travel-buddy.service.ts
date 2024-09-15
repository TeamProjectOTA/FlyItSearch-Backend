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
      where: { email },
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

    return await this.travelBuddyRepository.save(saveTravelBuddy);
  }
  async updateTravelBuddy(createTravelBuddyDto: TravelBuddyDto): Promise<any> {
    return;
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
