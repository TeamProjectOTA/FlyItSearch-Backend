export declare class AirportsModel {
    id: number;
    iata: string;
    icao: string;
    name: string;
    city_code: string;
    country_code: string;
    timezone: string;
    utc: string;
    latitude: number;
    longitude: number;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class AirportsModelUpdate {
    iata: string;
    icao: string;
    name: string;
    city_code: string;
    country_code: string;
    timezone: string;
    utc: string;
    latitude: number;
    longitude: number;
}
export declare class Airport {
    id: number;
    code: string | null;
    name: string | null;
    cityCode: string | null;
    cityName: string | null;
    countryName: string | null;
    countryCode: string | null;
}
export declare class CreateAirportDto {
    code: string | null;
    name: string | null;
    cityCode: string | null;
    cityName: string | null;
    countryName: string | null;
    countryCode: string | null;
}
