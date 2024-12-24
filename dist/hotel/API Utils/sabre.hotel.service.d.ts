import { RootDto } from "../DTO/hoteldto";
export declare class SabreHotel {
    restToken(): Promise<string>;
    sabreHotelRequest(hotelDto: RootDto): Promise<any>;
}
