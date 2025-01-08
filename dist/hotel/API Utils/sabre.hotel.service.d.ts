import { RootDto } from '../DTO/hoteldto';
import { SabreHotelUtils } from './sabre.hotel.util';
export declare class SabreHotel {
    private readonly sabreHotelUtils;
    constructor(sabreHotelUtils: SabreHotelUtils);
    restToken(): Promise<string>;
    sabreHotelRequest(hotelDto: RootDto): Promise<any>;
}
