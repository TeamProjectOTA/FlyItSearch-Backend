import { ApiProperty } from '@nestjs/swagger';

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
export class Inclusion {
  @ApiProperty({ default: 'This is the Inclusion' })
  data: string;
}
export class Exclusion {
  @ApiProperty({ default: 'This is the Exclusion' })
  data: string;
}
export class BookingPolicy {
  @ApiProperty({ default: 'This is the booking policy' })
  data: string;
}
export class RefundPolicy {
  @ApiProperty({ default: 'This is the Refund Policy' })
  data: string;
}
