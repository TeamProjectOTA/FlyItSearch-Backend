export declare class FlyHubUtil {
    constructor();
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    bookingDataTransformerFlyhb(SearchResponse: any): Promise<any[]>;
}
