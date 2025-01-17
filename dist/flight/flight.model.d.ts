export declare enum JourneyType {
    Economy = 1,
    Premium_Economy = 2,
    Business = 3,
    First = 4
}
declare class SegmentDto {
    depfrom: string;
    arrto: string;
    depdate: any;
}
export declare class FlightSearchModel {
    adultcount: number;
    childcount: number;
    infantcount: number;
    cabinclass: string;
    segments: SegmentDto[];
}
export declare class Flight {
    id: number;
    AdultQuantity: number;
    ChildQuantity: number;
    InfantQuantity: number;
    EndUserIp: string;
    JourneyType: number;
    Segments: Segment[];
}
export declare class Segment {
    id: number;
    Origin: string;
    Destination: string;
    CabinClass: string;
    DepartureDateTime: string;
    flight: Flight;
}
export declare class BookingIdSave {
    id: number;
    flyitSearchId: string;
    flyhubId: string;
}
export declare class BookingIdSaveDto {
    flyitSearchId: string;
    flyhubId: string;
}
export {};
