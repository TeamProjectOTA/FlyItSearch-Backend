import { TravelBuddyService } from './travel-buddy.service';
import { TravelBuddyDto } from './travel-buddy.model';
export declare class TravelBuddyController {
    private readonly travelBuddyService;
    constructor(travelBuddyService: TravelBuddyService);
    createTravelBuddy(createTravelBuddyDto: TravelBuddyDto, header: Headers): Promise<any>;
    deleteTravelBuddy(id: number): Promise<{
        message: string;
    }>;
}
