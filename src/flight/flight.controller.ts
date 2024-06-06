import { Controller, Post, Body } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight, flightModel } from './flight.model';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Flight-filters')
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post('filter')
  async filterFlights(@Body() filter: flightModel): Promise<Flight[]> {
    return await this.flightService.filterFlights(filter);
  }
}
