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
exports.TravelBuddyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const travel_buddy_model_1 = require("./travel-buddy.model");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const auth_service_1 = require("../auth/auth.service");
let TravelBuddyService = class TravelBuddyService {
    constructor(travelBuddyRepository, userRepository, authservice) {
        this.travelBuddyRepository = travelBuddyRepository;
        this.userRepository = userRepository;
        this.authservice = authservice;
    }
    async createTravelBuddy(createTravelBuddyDto, header) {
        const email = await this.authservice.decodeToken(header);
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            throw new common_1.NotFoundException('No Booking data available for the user');
        }
        let saveTravelBuddy = await this.travelBuddyRepository.findOne({
            where: { passport: createTravelBuddyDto.passport, user },
        });
        if (saveTravelBuddy) {
            throw new common_1.ConflictException('Please enter a new passport number');
        }
        else {
            saveTravelBuddy = this.travelBuddyRepository.create({
                ...createTravelBuddyDto,
                user,
            });
        }
        const savedata = await this.travelBuddyRepository.save(saveTravelBuddy);
        return {
            Title: savedata.title,
            Name: savedata.firstName + ` ` + savedata.lastName,
            Gender: savedata.gender,
            Nationality: savedata.nationality,
            PassportNumber: savedata.passport,
            DateOfBirth: savedata.dob,
            PassportExpiry: savedata.passportexp,
        };
    }
    async updateTravelBuddy(createTravelBuddyDto, id) {
        const travelBuddy = await this.travelBuddyRepository.findOne({
            where: { id: id },
            relations: ['user'],
        });
        travelBuddy.firstName = createTravelBuddyDto.firstName;
        travelBuddy.lastName = createTravelBuddyDto.lastName;
        travelBuddy.gender = createTravelBuddyDto.gender;
        travelBuddy.title = createTravelBuddyDto.title;
        travelBuddy.dob = createTravelBuddyDto.dob;
        travelBuddy.nationality = travelBuddy.nationality;
        travelBuddy.passport = travelBuddy.passport;
        travelBuddy.passportexp = travelBuddy.passportexp;
        return await this.travelBuddyRepository.save(travelBuddy);
    }
    async deleteTravelBuddy(id) {
        const travelBuddy = await this.travelBuddyRepository.findOne({
            where: { id: id },
        });
        if (!travelBuddy) {
            throw new common_1.NotFoundException('');
        }
        await this.travelBuddyRepository.delete(id);
        return {
            message: `The traveler named ${travelBuddy.firstName} ${travelBuddy.lastName} with this ${travelBuddy.passport} passport number was deleted successfully`,
        };
    }
};
exports.TravelBuddyService = TravelBuddyService;
exports.TravelBuddyService = TravelBuddyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(travel_buddy_model_1.TravelBuddy)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], TravelBuddyService);
//# sourceMappingURL=travel-buddy.service.js.map