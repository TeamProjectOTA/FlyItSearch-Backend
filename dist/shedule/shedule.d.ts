import { BookingSave } from 'src/book/booking.model';
import { BookingIdSave } from 'src/flight/flight.model';
import { Repository } from 'typeorm';
export declare class Shedule {
    private readonly bookingRepository;
    private readonly bookingIdRepository;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(bookingRepository: Repository<BookingSave>, bookingIdRepository: Repository<BookingIdSave>);
    scheduling(): Promise<void>;
    getToken(): Promise<string>;
    aircancel(BookingID: string): Promise<any>;
}
