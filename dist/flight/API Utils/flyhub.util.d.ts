import { BookingService } from 'src/book/booking.service';
export declare class FlyHubUtil {
    private readonly BookService;
    constructor(BookService: BookingService);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    dataTransformer(SearchResponse: any): Promise<any[]>;
    bookingDataTransformerFlyhb(SearchResponse: any, currentTimestamp?: any, header?: any): Promise<any[]>;
    saveBookingData(SearchResponse: any, header?: any): Promise<any>;
}
