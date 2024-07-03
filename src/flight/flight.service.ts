import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FlyAirSearchDto } from './API Utils/Dto/flyhub.model';
import { FlightSearchModel } from './flight.model';

@Injectable()
export class FlightService {
  async convertToFlyAirSearchDto(
    flightSearchModel: FlightSearchModel,
  ): Promise<FlyAirSearchDto> {
    const segments = flightSearchModel.segments.map((segment) => ({
      Origin: segment.depfrom,
      Destination: segment.arrto,
      CabinClass: flightSearchModel.cabinclass,
      DepartureDateTime: segment.depdate,
    }));

    const journeyType = this.determineJourneyType(segments);

    const flyAirSearchDto = plainToClass(FlyAirSearchDto, {
      AdultQuantity: flightSearchModel.adultcount,
      ChildQuantity: flightSearchModel.childcount,
      InfantQuantity: flightSearchModel.infantcount,
      EndUserIp: '11',
      JourneyType: journeyType,
      Segments: segments,
    });

    return flyAirSearchDto;
  }

  private determineJourneyType(segments: any[]): string {
    if (segments.length === 1) {
      return '1';
    }
    if (segments.length === 2) {
      if (
        segments[0].Destination === segments[1].Origin &&
        segments[0].Origin === segments[1].Destination
      ) {
        return '2';
      }
      return '3';
    }
    return '3';
  }
}
