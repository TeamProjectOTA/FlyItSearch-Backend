import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class FlyAirSearchDto {
  // @ApiProperty()
  // @IsInt()
  AdultQuantity: number;

  // @ApiProperty()
  // @IsInt()
  ChildQuantity: number;

  // @ApiProperty()
  // @IsInt()
  InfantQuantity: number;

  // @ApiProperty()
  // @IsString()
  EndUserIp: string;

  // @ApiProperty()
  // @IsString()
  JourneyType: string;

  @ApiProperty()
  Segments: {
    Origin: string;
    Destination: string;
    CabinClass: string;
    DepartureDateTime: string;
  }[];
}

export class searchResultDto {
  @ApiProperty()
  SearchId: string;
  @ApiProperty()
  ResultId: string;
}
export class BaggageDto {
  BaggageID: string;
}

export class MealDto {
  MealID: string;
}

export class PassengerDto {
  @ApiProperty()
  @IsString()
  Title: string;
  @IsString()
  @ApiProperty()
  FirstName: string;
  @IsString()
  @ApiProperty()
  LastName: string;
  @IsString()
  @ApiProperty()
  PaxType: string;
  @ApiProperty()
  DateOfBirth: Date;
  @IsString()
  @ApiProperty()
  Gender: string;
  @IsString()
  @ApiProperty()
  PassportNumber?: string;
  @ApiProperty()
  PassportExpiryDate?: Date;
  @ApiProperty()
  PassportNationality?: string;
  @ApiProperty()
  @IsString()
  Address1: string;
  @IsString()
  @ApiProperty()
  Address2?: string;
  @IsString()
  @ApiProperty()
  CountryCode: string;
  @IsString()
  @ApiProperty()
  Nationality: string;
  @IsString()
  @ApiProperty()
  ContactNumber: string;
  @IsString()
  @ApiProperty()
  Email: string;
  @IsBoolean()
  @ApiProperty()
  IsLeadPassenger: boolean;
  @ApiProperty()
  FFAirline?: string;
  @ApiProperty()
  FFNumber?: string;
  @ApiProperty()
  Baggage?: BaggageDto[];
  @ApiProperty()
  Meal?: MealDto[];
  visa?: string;
  passport?: string;
}

export class FlbFlightSearchDto {
  @ApiProperty()
  SearchID: string;
  @ApiProperty()
  ResultID: string;
  @ApiProperty()
  Passengers: PassengerDto[];
  @ApiProperty()
  PromotionCode?: string;
}
