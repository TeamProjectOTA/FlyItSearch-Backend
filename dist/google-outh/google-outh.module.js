"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOuthModule = void 0;
const common_1 = require("@nestjs/common");
const google_outh_controller_1 = require("./google-outh.controller");
const extands_stragey_1 = require("./extands.stragey");
const google_outh_service_1 = require("./google-outh.service");
const auth_module_1 = require("../auth/auth.module");
let GoogleOuthModule = class GoogleOuthModule {
};
exports.GoogleOuthModule = GoogleOuthModule;
exports.GoogleOuthModule = GoogleOuthModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [google_outh_controller_1.GoogleOuthController],
        providers: [extands_stragey_1.GoogleStrategy, google_outh_service_1.GoogleOuthService,],
    })
], GoogleOuthModule);
//# sourceMappingURL=google-outh.module.js.map