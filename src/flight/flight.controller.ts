import { Controller, Post, Body } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight, FlightSearchModel,  } from './flight.model';
import { ApiTags } from '@nestjs/swagger';
import { SabreService } from './sabre.flights.service';

@ApiTags('Flight-filters')
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService,private readonly sabreService:SabreService) {}



  @Post()
  search(@Body()flightdto:FlightSearchModel){
    return this.sabreService.shoppingBranded(flightdto)

  }
  // @Post('filter')
  // async filterFlights(@Body() filter: flightModel): Promise<Flight[]> {
  //   return await this.flightService.filterFlights(filter);
  // }
}
