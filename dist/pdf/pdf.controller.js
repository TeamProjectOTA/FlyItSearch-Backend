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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("./pdf.service");
const swagger_1 = require("@nestjs/swagger");
const pdf_model_1 = require("./pdf.model");
let PdfController = class PdfController {
    constructor(pdfservice) {
        this.pdfservice = pdfservice;
    }
    async generatePdf(jsonData, res) {
        try {
            const htmlContent = this.convertJsonToHtml(jsonData);
            const pdfBuffer = await this.pdfservice.generatePdfFromHtml(htmlContent);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=report.pdf',
                'Content-Length': pdfBuffer.length,
            });
            res.status(common_1.HttpStatus.OK).end(pdfBuffer);
        }
        catch (error) {
            res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error generating PDF' });
        }
    }
    convertJsonToHtml(jsonData) {
        const sectionsHtml = jsonData.sections
            .map((section) => `
      <h2>${section.heading}</h2>
      <p>${section.text}</p>
    `)
            .join('');
        return `
      <html>
        <head>
          <title>${jsonData.title}</title>
        </head>
        <body>
          <h1>${jsonData.title}</h1>
          <p>Author: ${jsonData.author}</p>
          <p>Date: ${jsonData.date}</p>
          ${sectionsHtml}
        </body>
      </html>
    `;
    }
    async getPdf(res) {
        const jsonData = [
            {
                System: 'FLYHUB',
                ResultId: '417799ad-151a-4285-acd1-fe182cc8fa4e',
                BookingId: 'FHB2407181373190',
                PNR: 'BXBIWB',
                BookingStatus: 'Booked',
                InstantPayment: false,
                IsBookable: true,
                FareType: 'NET',
                Carrier: 'EK',
                CarrierName: 'Emirates',
                BaseFare: 119023,
                Taxes: 29064,
                SerViceFee: 447,
                NetFare: 141869,
                GrossFare: 148534,
                PartialOption: false,
                PartialFare: 44561,
                TimeLimit: '2024-07-19T07:47:26',
                Refundable: false,
                ExtraService: null,
                PriceBreakDown: [
                    {
                        PaxType: 'Adult',
                        BaseFare: 41640,
                        Taxes: 9450,
                        ServiceFee: 154,
                        OtherCharges: 0,
                        TotalFare: 51244,
                        PaxCount: 2,
                        Bag: [
                            {
                                Airline: 'EK',
                                Allowance: '40kg',
                            },
                        ],
                        FareComponent: [
                            {
                                Origin: 'DAC',
                                Destination: 'DXB',
                                DepDate: '2024-08-19T10:15:00',
                                FareBasisCode: 'Q',
                                Carrier: 'EK',
                            },
                        ],
                    },
                    {
                        PaxType: 'Child',
                        BaseFare: 31260,
                        Taxes: 7450,
                        ServiceFee: 117,
                        OtherCharges: 0,
                        TotalFare: 38827,
                        PaxCount: 1,
                        Bag: [
                            {
                                Airline: 'EK',
                                Allowance: '40kg',
                            },
                        ],
                        FareComponent: [
                            {
                                Origin: 'DAC',
                                Destination: 'DXB',
                                DepDate: '2024-08-19T10:15:00',
                                FareBasisCode: 'Q',
                                Carrier: 'EK',
                            },
                        ],
                    },
                    {
                        PaxType: 'Infant',
                        BaseFare: 4483,
                        Taxes: 2714,
                        ServiceFee: 22,
                        OtherCharges: 0,
                        TotalFare: 7219,
                        PaxCount: 1,
                        Bag: [
                            {
                                Airline: 'EK',
                                Allowance: '10kg',
                            },
                        ],
                        FareComponent: [
                            {
                                Origin: 'DAC',
                                Destination: 'DXB',
                                DepDate: '2024-08-19T10:15:00',
                                FareBasisCode: 'Q',
                                Carrier: 'EK',
                            },
                        ],
                    },
                ],
                AllLegsInfo: [
                    {
                        DepDate: '2024-08-19T10:15:00',
                        DepFrom: 'DAC',
                        ArrTo: 'DXB',
                        TotalFlightDuration: 300,
                        Segments: [
                            {
                                MarketingCarrier: 'EK',
                                MarketingCarrierName: 'Emirates',
                                MarketingFlightNumber: 583,
                                OperatingCarrier: 'EK',
                                OperatingFlightNumber: 583,
                                OperatingCarrierName: 'Emirates',
                                DepFrom: 'DAC',
                                DepAirPort: 'Hazrat Shahjalal International Airport',
                                DepLocation: 'Dhaka, Bangladesh',
                                DepDateAdjustment: 0,
                                DepTime: '2024-08-19T10:15:00',
                                ArrTo: 'DXB',
                                ArrAirPort: 'Dubai International Airport',
                                ArrLocation: 'Dubai, United Arab Emirates',
                                ArrDateAdjustment: 0,
                                ArrTime: '2024-08-19T13:15:00',
                                OperatedBy: 'Emirates',
                                StopCount: '0',
                                Duration: 300,
                                AircraftTypeName: '77W',
                                Amenities: {},
                                DepartureGate: 'TBA',
                                ArrivalGate: 'TBA',
                                HiddenStops: [],
                                TotalMilesFlown: 0,
                                SegmentCode: {
                                    bookingCode: 'Q',
                                    cabinCode: 'Y',
                                    seatsAvailable: 0,
                                },
                            },
                        ],
                    },
                ],
                PassengerList: [
                    {
                        PaxIndex: 'P2134729',
                        Title: 'MS',
                        FirstName: 'JANE',
                        LastName: 'DOE',
                        PaxType: 'Adult',
                        DateOfBirth: '1985-02-15T00:00:00',
                        Gender: 'Female',
                        PassportNumber: 'B98765432',
                        PassportExpiryDate: '2032-02-15T00:00:00',
                        PassportNationality: null,
                        Address1: '123 Main St',
                        Address2: '',
                        CountryCode: 'US',
                        Nationality: null,
                        ContactNumber: '+1234567891',
                        Email: 'jane.doe@example.com',
                        FFAirline: null,
                        FFNumber: '',
                        Ticket: null,
                    },
                    {
                        PaxIndex: 'P2134730',
                        Title: 'MR',
                        FirstName: 'JOHN',
                        LastName: 'DOE',
                        PaxType: 'Adult',
                        DateOfBirth: '1980-01-01T00:00:00',
                        Gender: 'Male',
                        PassportNumber: 'A12345678',
                        PassportExpiryDate: '2030-01-01T00:00:00',
                        PassportNationality: null,
                        Address1: '123 Main St',
                        Address2: '',
                        CountryCode: 'US',
                        Nationality: null,
                        ContactNumber: '+1234567891',
                        Email: 'jane.doe@example.com',
                        FFAirline: null,
                        FFNumber: '',
                        Ticket: null,
                    },
                    {
                        PaxIndex: 'P2134731',
                        Title: 'MSTR',
                        FirstName: 'TOM',
                        LastName: 'DOE',
                        PaxType: 'Child',
                        DateOfBirth: '2015-07-20T00:00:00',
                        Gender: 'Male',
                        PassportNumber: 'C12345678',
                        PassportExpiryDate: '2025-07-20T00:00:00',
                        PassportNationality: null,
                        Address1: '123 Main St',
                        Address2: '',
                        CountryCode: 'US',
                        Nationality: null,
                        ContactNumber: '+1234567891',
                        Email: 'jane.doe@example.com',
                        FFAirline: null,
                        FFNumber: '',
                        Ticket: null,
                    },
                    {
                        PaxIndex: 'P2134732',
                        Title: 'MISS',
                        FirstName: 'LUCY',
                        LastName: 'DOE',
                        PaxType: 'Infant',
                        DateOfBirth: '2023-05-10T00:00:00',
                        Gender: 'Female',
                        PassportNumber: 'D87654321',
                        PassportExpiryDate: '2028-05-10T00:00:00',
                        PassportNationality: null,
                        Address1: '123 Main St',
                        Address2: '',
                        CountryCode: 'US',
                        Nationality: null,
                        ContactNumber: '+1234567891',
                        Email: 'jane.doe@example.com',
                        FFAirline: null,
                        FFNumber: '',
                        Ticket: null,
                    },
                ],
            },
        ];
        const buffer = await this.pdfservice.generatePdf(jsonData);
        const bookingId = jsonData[0].BookingId;
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Traveler_BookingId:${bookingId}.pdf`,
            'Content-Length': buffer.length,
        });
        res.send(buffer);
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pdf_model_1.ReportDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generatePdf", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "getPdf", null);
exports.PdfController = PdfController = __decorate([
    (0, swagger_1.ApiTags)('PDF'),
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map