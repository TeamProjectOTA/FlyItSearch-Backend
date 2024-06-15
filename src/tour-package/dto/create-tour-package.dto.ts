
import { ApiProperty } from '@nestjs/swagger';

export enum TripType{
    tp1="Family Tour",
    tp2="Group Tour",
    tp3="Relax"
}

export class CreateTourPackageDto {
    @ApiProperty({ default: 'Exciting Adventure' })
    mainTitle: string;
  
    @ApiProperty({ default: 'An unforgettable journey' })
    subTitle: string;
  
    @ApiProperty({ enum: TripType, isArray: true, default: [TripType.tp1, TripType.tp2] })
    tripType: TripType[];
  
    @ApiProperty({ default: '7 days' })
    journeyDuration: string;
  
    @ApiProperty({ default: '2024-07-01 (Monday)' })
    startDate: string;
  
    @ApiProperty({ default: '2024-07-07 (Sunday)' })
    endDate: string;
  
    @ApiProperty({ default: 'USA' })
    countryName: string;
  
    @ApiProperty({ default: 'New York' })
    cityName: string;
  
    @ApiProperty({ default: 'Multiple locations' })
    journeyLocation: string;
  
    @ApiProperty({ default: '50' })
    totalSeat: string;
  
    @ApiProperty({ default: 60 })
    maximunAge: number;
  
    @ApiProperty({ default: 18 })
    minimumAge: number;
  
    @ApiProperty({ default: 999.99 })
    packagePrice: number;
  
    @ApiProperty({ default: 10.00 })
    packageDiscount: number;
  
    @ApiProperty({ default: 'A thrilling 7-day adventure tour through multiple locations.' })
    packageOverview: string;
  }