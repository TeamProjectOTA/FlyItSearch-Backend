import { ApiProperty } from "@nestjs/swagger";

export enum TripType {
    tp1 = 'Family Tour',
    tp2 = 'Group Tour',
    tp3 = 'Relax',
  }
  
  export enum PackageInclude {
    pI1 = 'Flights',
    pI2 = 'Hotels',
    pI3 = 'Foods',
    pI4 = 'Transport',
  }
  
  export class TravelPackageInclusionDto {
    @ApiProperty({ enum: PackageInclude })
    type: PackageInclude;
  
    @ApiProperty({ default: 'Details about the inclusion.' })
    details?: string;
  }
  