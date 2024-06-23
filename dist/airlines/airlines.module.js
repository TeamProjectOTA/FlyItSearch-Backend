"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlinesModule = void 0;
const common_1 = require("@nestjs/common");
const airlines_controller_1 = require("./airlines.controller");
const airlines_service_1 = require("./airlines.service");
const typeorm_1 = require("@nestjs/typeorm");
const airlines_model_1 = require("./airlines.model");
const auth_module_1 = require("../auth/auth.module");
let AirlinesModule = class AirlinesModule {
};
exports.AirlinesModule = AirlinesModule;
exports.AirlinesModule = AirlinesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([airlines_model_1.AirlinesModel]), auth_module_1.AuthModule],
        controllers: [airlines_controller_1.AirlinesController],
        providers: [airlines_service_1.AirlinesService],
        exports: [airlines_service_1.AirlinesService],
    })
], AirlinesModule);
//# sourceMappingURL=airlines.module.js.map