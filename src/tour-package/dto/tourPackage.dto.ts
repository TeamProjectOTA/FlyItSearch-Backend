import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsObject } from 'class-validator';

// DTO for Introduction details
export class Introduction {
  @ApiProperty({
    description: 'Main title of the tour package introduction.',
    example: 'Himalayan Trekking Adventure',
    type: String,
  })
  mainTitle: string;

  @ApiProperty({
    description: 'Subtitle of the tour package.',
    example: 'An unforgettable journey to the highest peaks.',
    type: String,
  })
  subTitle: string;

  @ApiProperty({
    description: 'Type of trip (e.g., Adventure, Family, Romantic).',
    example: 'Adventure',
    type: String,
  })
  tripType: string;

  @ApiProperty({
    description: 'Duration of the journey (e.g., "7 days").',
    example: '7 days',
    type: String,
  })
  journeyDuration: string;

  @ApiProperty({
    description: 'Journey start date (e.g., "2025-06-01").',
    example: '2025-06-01',
    type: String,
  })
  journeyStartDate: string;

  @ApiProperty({
    description: 'Journey end date (e.g., "2025-06-07").',
    example: '2025-06-07',
    type: String,
  })
  journeyEndDate: string;

  @ApiProperty({
    description: 'Country where the journey will take place.',
    example: 'Nepal',
    type: String,
  })
  countryName: string;

  @ApiProperty({
    description: 'City where the journey will take place.',
    example: 'Kathmandu',
    type: String,
  })
  cityName: string;

  @ApiProperty({
    description: 'Location of the journey (e.g., Everest Region).',
    example: 'Everest Region',
    type: String,
  })
  journeyLocation: string;

  @ApiProperty({
    description: 'Total number of seats available for the tour.',
    example: '20',
    type: String,
  })
  totalSeat: string;

  @ApiProperty({
    description: 'Minimum age requirement for the tour.',
    example: '18',
    type: String,
  })
  minimumAge: string;

  @ApiProperty({
    description: 'Maximum age limit for the tour.',
    example: '65',
    type: String,
  })
  maximumAge: string;

  @ApiProperty({
    description: 'Price of the tour package.',
    example: '1500',
    type: String,
  })
  packagePrice: string;

  @ApiProperty({
    description: 'Discount on the package, if any.',
    example: '10%',
    type: String,
  })
  packageDiscount?: string;
}


export class TourPlanDto {
  @ApiProperty({
    description: 'Title for the day plan (e.g., "Day 1 - Arrival").',
    example: 'Day 1 - Arrival',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'Description of the day’s plan (e.g., activities and schedule).',
    example: 'Arrive in Kathmandu and get settled at the hotel.',
    type: String,
  })
  plan: string;
}

export class CreateTourPackageDto {
  @ApiProperty({
    description: 'Status of the package (e.g., "Active", "Inactive").',
    example: 'Active',
    type: String,
  })
  status: string;

  @ApiProperty({
    description: 'Type of the tour package (e.g., "Adventure", "Family", "Romantic").',
    example: 'Adventure',
    type: String,
  })
  packageType: string;

  @ApiProperty({
    description: 'A brief overview of the package.',
    example: {
      packageOverView: 'An exciting adventure exploring the wild mountains.',
      packageInclude: ['Flights', 'Hotels', 'Meals', 'Transport'],
    },
    type: Object,
  })
  overView: {
    packageOverView: string;
    packageInclude: string[];
  };

  @ApiProperty({
    description: 'Main images associated with the package.',
    example: ['image1.jpg', 'image2.jpg'],
    type: [String],
  })
  @IsArray()
  mainImage: string[];

  @ApiProperty({
    description: 'List of places included in the tour package.',
    example: ['Mount Everest Base Camp', 'Kathmandu', 'Pokhara'],
    type: [String],
  })
  @IsArray()
  visitPlace: string[];

  @ApiProperty({
    description: 'Tour plan schedule for the package (e.g., day-by-day itinerary).',
    example: {
      day1: 'Arrive in Kathmandu and get settled.',
      day2: 'Fly to Pokhara and begin trekking.',
    },
    type: Object,
  })
  @IsObject()
  tourPlan: any;

  @ApiProperty({
    description: 'Additional policies and information regarding the tour package.',
    example: {
      inclusion: ['Guided tour', 'Meals provided', 'Trekking equipment'],
      exclusion: ['Personal expenses', 'Travel insurance'],
      bookingPolicy: 'Booking should be made at least 30 days in advance.',
      refundPolicy: '50% refund if canceled within 7 days of booking.',
    },
    type: Object,
  })
  @IsObject()
  objective: {
    inclusion: any;
    exclusion: any;
    bookingPolicy: any;
    refundPolicy: any;
  };

  @ApiProperty({
    description: 'Meta information for SEO purposes, including meta title, keywords, and description.',
    example: {
      metaTitle: 'Mountain Adventure Tour',
      metaKeyword: ['Adventure', 'Trekking', 'Nepal', 'Everest'],
      metadescription: 'Join our thrilling mountain adventure and explore the beauty of the Himalayas. Trek to Everest Base Camp.',
    },
    type: Object,
  })
  @IsObject()
  metaInfo: {
    metaTitle: string;
    metaKeyword: string[];
    metadescription: string;
  };

  @ApiProperty({
    description: 'Introduction details for the tour package (e.g., title, subtitle, pricing).',
    type: Introduction,
  })
  introduction: Introduction;

  @ApiProperty({
    description: 'List of daily tour plans for the tour package.',
    type: [TourPlanDto],
  })
  @IsArray()
  tourPlans: TourPlanDto[];
}

export class TourPackageDto {
  @ApiProperty({
    description: 'Unique identifier for the tour package.',
    example: 'PKG12345',
    type: String,
  })
  packageId: string;

  @ApiProperty({
    description: 'Status of the package (e.g., "Active", "Inactive").',
    example: 'Active',
    type: String,
  })
  status: string;

  @ApiProperty({
    description: 'Type of the tour package (e.g., "Adventure", "Family", "Romantic").',
    example: 'Adventure',
    type: String,
  })
  packageType: string;

  @ApiProperty({
    description: 'A brief overview of the package.',
    example: {
      packageOverView: 'An exciting adventure exploring the wild mountains.',
      packageInclude: ['Flights', 'Hotels', 'Meals', 'Transport'],
    },
    type: Object,
  })
  overView: {
    packageOverView: string;
    packageInclude: string[];
  };

  @ApiProperty({
    description: 'Main images associated with the package.',
    example: ['image1.jpg', 'image2.jpg'],
    type: [String],
  })
  mainImage: string[];

  @ApiProperty({
    description: 'List of places included in the tour package.',
    example: ['Mount Everest Base Camp', 'Kathmandu', 'Pokhara'],
    type: [String],
  })
  visitPlace: string[];

  @ApiProperty({
    description: 'Tour plan schedule for the package (e.g., day-by-day itinerary).',
    example: {
      day1: 'Arrive in Kathmandu and get settled.',
      day2: 'Fly to Pokhara and begin trekking.',
    },
    type: Object,
  })
  tourPlan: any;

  @ApiProperty({
    description: 'Additional policies and information regarding the tour package.',
    example: {
      inclusion: ['Guided tour', 'Meals provided', 'Trekking equipment'],
      exclusion: ['Personal expenses', 'Travel insurance'],
      bookingPolicy: 'Booking should be made at least 30 days in advance.',
      refundPolicy: '50% refund if canceled within 7 days of booking.',
    },
    type: Object,
  })
  objective: {
    inclusion: any;
    exclusion: any;
    bookingPolicy: any;
    refundPolicy: any;
  };

  @ApiProperty({
    description: 'Meta information for SEO purposes, including meta title, keywords, and description.',
    example: {
      metaTitle: 'Mountain Adventure Tour',
      metaKeyword: ['Adventure', 'Trekking', 'Nepal', 'Everest'],
      metadescription: 'Join our thrilling mountain adventure and explore the beauty of the Himalayas. Trek to Everest Base Camp.',
    },
    type: Object,
  })
  metaInfo: {
    metaTitle: string;
    metaKeyword: string[];
    metadescription: string;
  };

  @ApiProperty({
    description: 'Introduction details for the tour package (e.g., title, subtitle, pricing).',
    type: Introduction,
  })
  introduction: Introduction;

  @ApiProperty({
    description: 'List of daily tour plans for the tour package.',
    type: [TourPlanDto],
  })
  tourPlans: TourPlanDto[];
}
