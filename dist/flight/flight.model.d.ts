export declare enum JourneyType {
    Economy = 1,
    Premium_Economy = 2,
    Business = 3,
    First = 4
}
export declare class flightModel {
    journyType: string;
    adultCount: number;
    childerenCount: number;
    infantCount: number;
    Segments: SegmentModel[];
    cities: CityInfo[];
}
export declare class SegmentModel {
    Origin: string;
    Destination: string;
    CabinClass: JourneyType;
    DepartureDateTime: string;
}
export declare class CityInfo {
    from: string;
    to: string;
    journyDate: string;
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
