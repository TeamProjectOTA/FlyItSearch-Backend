import { BookService } from 'src/book/book.service';
export declare class FlyHubUtil {
    private readonly BookService;
    constructor(BookService: BookService);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    dataTransformer(SearchResponse: any): Promise<any[]>;
    bookingDataTransformerFlyhb(SearchResponse: any, currentTimestamp?: any, header?: any): Promise<any[]>;
    saveBookingData(SearchResponse: any, header?: any): Promise<any>;
}
