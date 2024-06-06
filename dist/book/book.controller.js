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
exports.BookController = void 0;
const common_1 = require("@nestjs/common");
const book_service_1 = require("./book.service");
const platform_express_1 = require("@nestjs/platform-express");
const book_model_1 = require("./book.model");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
let BookController = class BookController {
    constructor(fileupload) {
        this.fileupload = fileupload;
    }
    async uploadFile(file) {
        return await this.fileupload.saveFile(file);
    }
    getUserInfo() {
        const userDetails = {
            designation: book_model_1.Designation.Mr,
            address: '',
            mobileNumber: '',
            department: '',
            avatar: '',
            gender: '',
            passportNumber: '',
            passportExpireDate: '',
            country: '',
            city: '',
            postCode: '',
            passport: '',
            seatPreference: 'No Preference',
            mealPreference: '',
            nationality: '',
            frequentFlyerNumber: '',
            passportCopy: '',
            visaCopy: '',
            quickPick: true,
            titleName: '',
            givenName: '',
            surName: '',
            address1: '',
            dateOfBirth: '',
            age: '',
            username: 'hasibul.flyitsearch_lwyhq1ug',
            email: 'hasibul.flyitsearch@gmail.com',
            referralCode: 'ST88238957',
            otherPassengers: [],
            ssr: [
                {
                    type: 'Wheelchair',
                    ssr: [
                        {
                            code: 'WCHR',
                            name: 'Passenger can not walk short distance up or down stairs.',
                        },
                        {
                            code: 'WCHS',
                            name: 'Passenger can not walk short distance, but not up or down stairs',
                        },
                        {
                            code: 'WCHC',
                            name: 'Passenger cannot walk any distance and will require the aisle chair to board.',
                        },
                        { code: 'WCOB', name: 'On-board aisle wheelchair requested' },
                        {
                            code: 'WCMP',
                            name: 'Passenger is traveling with a manual wheelchair.',
                        },
                        {
                            code: 'WCBD',
                            name: 'Passenger is traveling with a dry cell battery-powered wheelchair.',
                        },
                        {
                            code: 'WCBW',
                            name: 'Passenger is traveling with a wet cell battery-powered wheelchair.',
                        },
                    ],
                },
                {
                    type: 'Meal',
                    ssr: [
                        { code: 'AVML', name: 'ASIAN VEGETARIAN MEAL' },
                        { code: 'BBML', name: 'INFANT/BABY FOOD' },
                        { code: 'CHML', name: 'CHILD MEAL' },
                        { code: 'DBML', name: 'DIABETIC MEAL' },
                        { code: 'SFML', name: 'SEA FOOD MEAL' },
                        { code: 'MOML', name: 'MUSLIM MEAL' },
                    ],
                },
                {
                    type: 'Other',
                    ssr: [
                        { code: 'BLND', name: 'Passenger is blind or has reduced vision' },
                        { code: 'DEAF', name: 'Passenger is deaf or hard of hearing' },
                    ],
                },
            ],
        };
        return {
            code: 'SUCCESS',
            message: 'Successfully retrieve user information',
            response: userDetails,
        };
    }
};
exports.BookController = BookController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './src/AllFile',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", book_model_1.ResponseDto)
], BookController.prototype, "getUserInfo", null);
exports.BookController = BookController = __decorate([
    (0, swagger_1.ApiTags)('Booking-Details'),
    (0, common_1.Controller)('book'),
    __metadata("design:paramtypes", [book_service_1.BookService])
], BookController);
//# sourceMappingURL=book.controller.js.map