import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

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