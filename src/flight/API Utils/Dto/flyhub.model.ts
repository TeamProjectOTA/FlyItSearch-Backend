import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class SegmentDto {
  @IsString()
  @IsNotEmpty()
  Origin: string;

  @IsString()
  @IsNotEmpty()
  Destination: string;

  @IsInt()
  @Min(1)
  CabinClass: number;

  @IsDateString()
  @IsNotEmpty()
  DepartureDateTime: string;
}

export class FlyAirSearchDto {
  
  AdultQuantity: number;

 
  ChildQuantity: number;

 
  InfantQuantity: number;

  // @IsIP()
  EndUserIp: string;

  @IsString()
  JourneyType: string;

  @Type(() => SegmentDto)
  Segments: SegmentDto[];
}
