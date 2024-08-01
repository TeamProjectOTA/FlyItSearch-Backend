export declare class FlyHubUtil {
    constructor();
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    bookingDataTransformerFlyhb(SearchResponse: any, currentTimestamp?: any): Promise<any[]>;
    saveBookingData(SearchResponse: any, header: any): Promise<any>;
}
