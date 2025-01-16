"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const uploads_service_1 = require("./uploads.service");
const uploads_controller_1 = require("./uploads.controller");
const typeorm_1 = require("@nestjs/typeorm");
const uploads_model_1 = require("./uploads.model");
const user_entity_1 = require("../user/entities/user.entity");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const booking_model_1 = require("../book/booking.model");
const upload_provider_service_1 = require("./upload.provider.service");
let UploadsModule = class UploadsModule {
};
exports.UploadsModule = UploadsModule;
exports.UploadsModule = UploadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([uploads_model_1.ProfilePicture, user_entity_1.User, booking_model_1.BookingSave]),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [uploads_controller_1.UploadsController],
        providers: [uploads_service_1.UploadsService, upload_provider_service_1.DoSpacesServicerovider],
        exports: [upload_provider_service_1.DoSpacesServicerovider]
    })
], UploadsModule);
//# sourceMappingURL=uploads.module.js.map