export declare class RefPointDto {
    Value: string;
    ValueContext: string;
    RefPointType: string;
}
export declare class GeoRefDto {
    Radius: number;
    UOM: string;
    RefPoint: RefPointDto;
}
export declare class GeoSearchDto {
    GeoRef: GeoRefDto;
}
export declare class StayDateRangeDto {
    StartDate: string;
    EndDate: string;
}
export declare class RoomDto {
    Index: number;
    Adults: number;
}
export declare class RoomsDto {
    Room: RoomDto[];
}
export declare class RateInfoRefDto {
    ConvertedRateInfoOnly: boolean;
    CurrencyCode: string;
    BestOnly: string;
    PrepaidQualifier: string;
    StayDateRange: StayDateRangeDto;
    Rooms: RoomsDto;
}
export declare class SabreRatingDto {
    Min: string;
    Max: string;
}
export declare class HotelPrefDto {
    SabreRating: SabreRatingDto;
}
export declare class ImageRefDto {
    Type: string;
    LanguageCode: string;
}
export declare class SearchCriteriaDto {
    OffSet: number;
    SortBy: string;
    SortOrder: string;
    PageSize: number;
    TierLabels: boolean;
    GeoSearch: GeoSearchDto;
    RateInfoRef: RateInfoRefDto;
    HotelPref: HotelPrefDto;
    ImageRef: ImageRefDto;
}
export declare class GetHotelAvailRQDto {
    SearchCriteria: SearchCriteriaDto;
}
export declare class RootDto {
    GetHotelAvailRQ: GetHotelAvailRQDto;
}
