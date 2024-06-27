export declare class SegmentDto {
    Origin: string;
    Destination: string;
    CabinClass: number;
    DepartureDateTime: string;
}
export declare class FlyAirSearchDto {
    AdultQuantity: number;
    ChildQuantity: number;
    InfantQuantity: number;
    EndUserIp: string;
    JourneyType: string;
    Segments: SegmentDto[];
}
