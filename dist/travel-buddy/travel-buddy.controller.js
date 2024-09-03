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
exports.TravelBuddyController = void 0;
const common_1 = require("@nestjs/common");
const travel_buddy_service_1 = require("./travel-buddy.service");
const travel_buddy_model_1 = require("./travel-buddy.model");
const swagger_1 = require("@nestjs/swagger");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
let TravelBuddyController = class TravelBuddyController {
    constructor(travelBuddyService) {
        this.travelBuddyService = travelBuddyService;
    }
    async createTravelBuddy(createTravelBuddyDto, header) {
        return await this.travelBuddyService.createTravelBuddy(createTravelBuddyDto, header);
    }
    async deleteTravelBuddy(id) {
        return await this.travelBuddyService.deleteTravelBuddy(id);
    }
};
exports.TravelBuddyController = TravelBuddyController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('/saveTravelBuddy'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [travel_buddy_model_1.TravelBuddyDto, Object]),
    __metadata("design:returntype", Promise)
], TravelBuddyController.prototype, "createTravelBuddy", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Delete)('/deleteTravelBuddy/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TravelBuddyController.prototype, "deleteTravelBuddy", null);
exports.TravelBuddyController = TravelBuddyController = __decorate([
    (0, swagger_1.ApiTags)('Tarvel Buddy'),
    (0, common_1.Controller)('travel-buddy'),
    __metadata("design:paramtypes", [travel_buddy_service_1.TravelBuddyService])
], TravelBuddyController);
//# sourceMappingURL=travel-buddy.controller.js.map