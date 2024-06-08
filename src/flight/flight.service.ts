import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class FlightService {
  // constructor(
  //   @InjectRepository(Flight)
  //   private readonly flightRepository: Repository<Flight>,
  // ) {}

  // async filterFlights(filter: flightModel){
  // //   let query = this.flightRepository.createQueryBuilder('flight');
  // //   if (filter.journyType) {
  // //     query = query.andWhere('flight.JourneyType = :journeyType', {
  // //       journeyType: filter.journyType,
  // //     });
  // //   }
  // //   if (filter.adultCount) {
  // //     query = query.andWhere('flight.AdultQuantity >= :adultCount', {
  // //       adultCount: filter.adultCount,
  // //     });
  // //   }
  // //   if (filter.childerenCount) {
  // //     query = query.andWhere('flight.ChildQuantity >= :childerenCount', {
  // //       childCount: filter.childerenCount,
  // //     });
  // //   }
  // //   if (filter.infantCount) {
  // //     query = query.andWhere('flight.InfantQuantity >= :infantCount', {
  // //       infantCount: filter.infantCount,
  // //     });
  // //   }
  // //   if (filter.Segments && filter.Segments.length > 0) {
  // //     filter.Segments.forEach((segment: SegmentModel, index: number) => {
  // //       const segmentAlias = `segment_${index}`;
  // //       query = query.innerJoinAndSelect('flight.Segments', segmentAlias);
  // //       query = query.andWhere(`${segmentAlias}.Origin = :origin${index}`, {
  // //         [`origin${index}`]: segment.Origin,
  // //       });
  // //       query = query.andWhere(
  // //         `${segmentAlias}.Destination = :destination${index}`,
  // //         { [`destination${index}`]: segment.Destination },
  // //       );
  // //       query = query.andWhere(
  // //         `${segmentAlias}.CabinClass = :cabinClass${index}`,
  // //         { [`cabinClass${index}`]: segment.CabinClass },
  // //       );
  // //       query = query.andWhere(
  // //         `${segmentAlias}.DepartureDateTime = :departureDateTime${index}`,
  // //         { [`departureDateTime${index}`]: segment.DepartureDateTime },
  // //       );
  // //     });
  // //   }
  // //   if (filter.cities && filter.cities.length > 0) {
  // //     filter.cities.forEach((city: CityInfo, index: number) => {
  // //       query = query.andWhere(`JSON_CONTAINS(flight.cities, :city${index})`, {
  // //         [`city${index}`]: JSON.stringify(city),
  // //       });
  // //     });
  // //   }

  // //   return await query.getMany();
  // }
}
