import { HotelService } from './hotel.service';
import { SabreHotel } from './API Utils/sabre.hotel.service';
import { RootDto } from './DTO/hoteldto';
export declare class HotelController {
    private readonly hotelService;
    private readonly sabreHotel;
    constructor(hotelService: HotelService, sabreHotel: SabreHotel);
    hotelRequest(hoteldto: RootDto): Promise<any>;
}
