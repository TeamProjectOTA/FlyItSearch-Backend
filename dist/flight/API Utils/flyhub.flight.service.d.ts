import { FlyHubUtil } from './flyhub.util';
import { FlbFlightSearchDto, FlyAirSearchDto, searchResultDto } from './Dto/flyhub.model';
import { FlightSearchModel } from '../flight.model';
import { Admin } from 'src/admin/entities/admin.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { BookingID } from 'src/book/booking.model';
export declare class FlyHubService {
    private readonly flyHubUtil;
    private readonly adminRepository;
    private readonly authService;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(flyHubUtil: FlyHubUtil, adminRepository: Repository<Admin>, authService: AuthService);
    getToken(): Promise<string>;
    searchFlights(reqBody: FlyAirSearchDto): Promise<any>;
    aircancel(BookingID: BookingID, uuid: string, header?: any): Promise<any>;
    airRetrive(BookingID: BookingID): Promise<any>;
    bookingRules(data: searchResultDto): Promise<any>;
    airPrice(data: searchResultDto): Promise<any[]>;
    airRules(data: searchResultDto): Promise<any>;
    airbook(data: FlbFlightSearchDto, uuid: string, currentTimestamp?: Date, header?: any): Promise<any[]>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel, userIp: string, uuid: string, header: any): Promise<any>;
    private determineJourneyType;
}
