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
exports.GoogleOuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const google_outh_service_1 = require("./google-outh.service");
const swagger_1 = require("@nestjs/swagger");
let GoogleOuthController = class GoogleOuthController {
    constructor(appService) {
        this.appService = appService;
    }
    async googleAuth(req) { }
    googleAuthRedirect(req) {
        return this.appService.googleLogin(req);
    }
    async facebookAuth(req) { }
    facebookAuthRedirect(req) {
        return this.appService.facebookLogin(req);
    }
};
exports.GoogleOuthController = GoogleOuthController;
__decorate([
    (0, common_1.Get)('/google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoogleOuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('/googleRedirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoogleOuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('/facebook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoogleOuthController.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)('/facebookRedirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoogleOuthController.prototype, "facebookAuthRedirect", null);
exports.GoogleOuthController = GoogleOuthController = __decorate([
    (0, swagger_1.ApiTags)('Google-log-in'),
    (0, common_1.Controller)('social-site'),
    __metadata("design:paramtypes", [google_outh_service_1.GoogleOuthService])
], GoogleOuthController);
//# sourceMappingURL=google-outh.controller.js.map