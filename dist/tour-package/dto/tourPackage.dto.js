"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourPackageDto = exports.CreateTourPackageDto = exports.TourPlanDto = exports.Introduction = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class Introduction {
}
exports.Introduction = Introduction;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main title of the tour package introduction.',
        example: 'Himalayan Trekking Adventure',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "mainTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subtitle of the tour package.',
        example: 'An unforgettable journey to the highest peaks.',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "subTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of trip (e.g., Adventure, Family, Romantic).',
        example: 'Adventure',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duration of the journey (e.g., "7 days").',
        example: '7 days',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "journeyDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Journey start date (e.g., "2025-06-01").',
        example: '2025-06-01',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "journeyStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Journey end date (e.g., "2025-06-07").',
        example: '2025-06-07',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "journeyEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country where the journey will take place.',
        example: 'Nepal',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "countryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City where the journey will take place.',
        example: 'Kathmandu',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "cityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location of the journey (e.g., Everest Region).',
        example: 'Everest Region',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "journeyLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of seats available for the tour.',
        example: '20',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "totalSeat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum age requirement for the tour.',
        example: '18',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "minimumAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum age limit for the tour.',
        example: '65',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "maximumAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price of the tour package.',
        example: '1500',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "packagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discount on the package, if any.',
        example: '10%',
        type: String,
    }),
    __metadata("design:type", String)
], Introduction.prototype, "packageDiscount", void 0);
class TourPlanDto {
}
exports.TourPlanDto = TourPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title for the day plan (e.g., "Day 1 - Arrival").',
        example: 'Day 1 - Arrival',
        type: String,
    }),
    __metadata("design:type", String)
], TourPlanDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the day’s plan (e.g., activities and schedule).',
        example: 'Arrive in Kathmandu and get settled at the hotel.',
        type: String,
    }),
    __metadata("design:type", String)
], TourPlanDto.prototype, "plan", void 0);
class CreateTourPackageDto {
}
exports.CreateTourPackageDto = CreateTourPackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the package (e.g., "Active", "Inactive").',
        example: 'Active',
        type: String,
    }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the tour package (e.g., "Adventure", "Family", "Romantic").',
        example: 'Adventure',
        type: String,
    }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "packageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A brief overview of the package.',
        example: {
            packageOverView: 'An exciting adventure exploring the wild mountains.',
            packageInclude: ['Flights', 'Hotels', 'Meals', 'Transport'],
        },
        type: Object,
    }),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "overView", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main images associated with the package.',
        example: ['image1.jpg', 'image2.jpg'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "mainImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of places included in the tour package.',
        example: ['Mount Everest Base Camp', 'Kathmandu', 'Pokhara'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "visitPlace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tour plan schedule for the package (e.g., day-by-day itinerary).',
        example: {
            day1: 'Arrive in Kathmandu and get settled.',
            day2: 'Fly to Pokhara and begin trekking.',
        },
        type: Object,
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "tourPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional policies and information regarding the tour package.',
        example: {
            inclusion: ['Guided tour', 'Meals provided', 'Trekking equipment'],
            exclusion: ['Personal expenses', 'Travel insurance'],
            bookingPolicy: 'Booking should be made at least 30 days in advance.',
            refundPolicy: '50% refund if canceled within 7 days of booking.',
        },
        type: Object,
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta information for SEO purposes, including meta title, keywords, and description.',
        example: {
            metaTitle: 'Mountain Adventure Tour',
            metaKeyword: ['Adventure', 'Trekking', 'Nepal', 'Everest'],
            metadescription: 'Join our thrilling mountain adventure and explore the beauty of the Himalayas. Trek to Everest Base Camp.',
        },
        type: Object,
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "metaInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Introduction details for the tour package (e.g., title, subtitle, pricing).',
        type: Introduction,
    }),
    __metadata("design:type", Introduction)
], CreateTourPackageDto.prototype, "introduction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of daily tour plans for the tour package.',
        type: [TourPlanDto],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "tourPlans", void 0);
class TourPackageDto {
}
exports.TourPackageDto = TourPackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the tour package.',
        example: 'PKG12345',
        type: String,
    }),
    __metadata("design:type", String)
], TourPackageDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the package (e.g., "Active", "Inactive").',
        example: 'Active',
        type: String,
    }),
    __metadata("design:type", String)
], TourPackageDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the tour package (e.g., "Adventure", "Family", "Romantic").',
        example: 'Adventure',
        type: String,
    }),
    __metadata("design:type", String)
], TourPackageDto.prototype, "packageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A brief overview of the package.',
        example: {
            packageOverView: 'An exciting adventure exploring the wild mountains.',
            packageInclude: ['Flights', 'Hotels', 'Meals', 'Transport'],
        },
        type: Object,
    }),
    __metadata("design:type", Object)
], TourPackageDto.prototype, "overView", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main images associated with the package.',
        example: ['image1.jpg', 'image2.jpg'],
        type: [String],
    }),
    __metadata("design:type", Array)
], TourPackageDto.prototype, "mainImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of places included in the tour package.',
        example: ['Mount Everest Base Camp', 'Kathmandu', 'Pokhara'],
        type: [String],
    }),
    __metadata("design:type", Array)
], TourPackageDto.prototype, "visitPlace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tour plan schedule for the package (e.g., day-by-day itinerary).',
        example: {
            day1: 'Arrive in Kathmandu and get settled.',
            day2: 'Fly to Pokhara and begin trekking.',
        },
        type: Object,
    }),
    __metadata("design:type", Object)
], TourPackageDto.prototype, "tourPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional policies and information regarding the tour package.',
        example: {
            inclusion: ['Guided tour', 'Meals provided', 'Trekking equipment'],
            exclusion: ['Personal expenses', 'Travel insurance'],
            bookingPolicy: 'Booking should be made at least 30 days in advance.',
            refundPolicy: '50% refund if canceled within 7 days of booking.',
        },
        type: Object,
    }),
    __metadata("design:type", Object)
], TourPackageDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta information for SEO purposes, including meta title, keywords, and description.',
        example: {
            metaTitle: 'Mountain Adventure Tour',
            metaKeyword: ['Adventure', 'Trekking', 'Nepal', 'Everest'],
            metadescription: 'Join our thrilling mountain adventure and explore the beauty of the Himalayas. Trek to Everest Base Camp.',
        },
        type: Object,
    }),
    __metadata("design:type", Object)
], TourPackageDto.prototype, "metaInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Introduction details for the tour package (e.g., title, subtitle, pricing).',
        type: Introduction,
    }),
    __metadata("design:type", Introduction)
], TourPackageDto.prototype, "introduction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of daily tour plans for the tour package.',
        type: [TourPlanDto],
    }),
    __metadata("design:type", Array)
], TourPackageDto.prototype, "tourPlans", void 0);
//# sourceMappingURL=tourPackage.dto.js.map