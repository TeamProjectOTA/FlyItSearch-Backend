export declare class FlyAirSearchDto {
    AdultQuantity: number;
    ChildQuantity: number;
    InfantQuantity: number;
    EndUserIp: string;
    JourneyType: string;
    Segments: {
        Origin: string;
        Destination: string;
        CabinClass: string;
        DepartureDateTime: string;
    }[];
}
export declare class searchResultDto {
    SearchId: string;
    ResultID: string;
}
