import { Repository } from 'typeorm';
import { Airport, AirportsModel, AirportsModelUpdate } from './airports.model';
export declare class AirportsService {
    private readonly airportsRepository;
    private readonly airportRepository;
    constructor(airportsRepository: Repository<AirportsModel>, airportRepository: Repository<Airport>);
    create(createAirportDto: AirportsModel): Promise<AirportsModel>;
    findAll(): Promise<AirportsModel[]>;
    findFormateAll(): Promise<AirportsModel[]>;
    findOne(id: number): Promise<AirportsModel>;
    update(id: number, updateAirportDto: AirportsModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<AirportsModel[]>;
    getAirportName(code: string): Promise<string>;
    getAirportLocation(code: string): Promise<string>;
    getCountry(code: string): Promise<string>;
    airportName(code: string): Promise<"Not Found" | Airport>;
}
