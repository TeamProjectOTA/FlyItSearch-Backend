export declare class OriginDepRequestDto {
    iatA_LocationCode: string;
    date: string;
}
export declare class DestArrivalRequestDto {
    iatA_LocationCode: string;
}
export declare class OriginDestDto {
    originDepRequest: OriginDepRequestDto;
    destArrivalRequest: DestArrivalRequestDto;
}
export declare class PaxDto {
    paxID: string;
    ptc: string;
}
export declare class TravelPreferencesDto {
    cabinCode: string;
}
export declare class ShoppingCriteriaDto {
    tripType: string;
    travelPreferences: TravelPreferencesDto;
    returnUPSellInfo: boolean;
}
export declare class RequestInnerDto {
    originDest: OriginDestDto[];
    pax: PaxDto[];
    shoppingCriteria: ShoppingCriteriaDto;
}
export declare class RequestDto {
    pointOfSale: string;
    request: RequestInnerDto;
}
