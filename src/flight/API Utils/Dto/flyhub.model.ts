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

//Booking dto

export class BaggageDto {
  BaggageID: string;
}

export class MealDto {
  MealID: string;
}

export class PassengerDto {
  @IsString()
  Title: string;
  @IsString()
  FirstName: string;

  @IsString()
  LastName: string;
  @IsString()
  PaxType: string;
  DateOfBirth: Date;
  @IsString()
  Gender: string;
  @IsString()
  PassportNumber?: string;
  PassportExpiryDate?: Date;
  PassportNationality?: string;

  @IsString()
  Address1: string;
  @IsString()
  Address2?: string;
  @IsString()
  CountryCode: string;
  @IsString()
  Nationality: string;
  @IsString()
  ContactNumber: string;
  @IsString()
  Email: string;
  @IsBoolean()
  IsLeadPassenger: boolean;
  FFAirline?: string;
  FFNumber?: string;
  Baggage?: BaggageDto[];
  Meal?: MealDto[];
}

export class FlbFlightSearchDto {
  @ApiProperty()
  SearchID: string;
  ResultID: string;
  Passengers: PassengerDto[];
  PromotionCode?: string;
}
