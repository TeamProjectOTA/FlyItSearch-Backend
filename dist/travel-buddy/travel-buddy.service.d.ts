import { TravelBuddy, TravelBuddyDto } from './travel-buddy.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class TravelBuddyService {
    private readonly travelBuddyRepository;
    private readonly userRepository;
    private readonly authservice;
    constructor(travelBuddyRepository: Repository<TravelBuddy>, userRepository: Repository<User>, authservice: AuthService);
    createTravelBuddy(createTravelBuddyDto: TravelBuddyDto, header: any): Promise<any>;
    updateTravelBuddy(createTravelBuddyDto: TravelBuddyDto): Promise<any>;
    deleteTravelBuddy(id: number): Promise<{
        message: string;
    }>;
}
