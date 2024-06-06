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
exports.Segment = exports.Flight = exports.CityInfo = exports.SegmentModel = exports.flightModel = exports.JourneyType = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
var JourneyType;
(function (JourneyType) {
    JourneyType[JourneyType["Economy"] = 1] = "Economy";
    JourneyType[JourneyType["Premium_Economy"] = 2] = "Premium_Economy";
    JourneyType[JourneyType["Business"] = 3] = "Business";
    JourneyType[JourneyType["First"] = 4] = "First";
})(JourneyType || (exports.JourneyType = JourneyType = {}));
class flightModel {
}
exports.flightModel = flightModel;
__decorate([
    (0, class_validator_1.IsIn)(['One way', 'Round Way', 'Multi City']),
    __metadata("design:type", String)
], flightModel.prototype, "journyType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], flightModel.prototype, "Segments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    __metadata("design:type", Array)
], flightModel.prototype, "cities", void 0);
class SegmentModel {
}
exports.SegmentModel = SegmentModel;
__decorate([
    (0, class_validator_1.IsEnum)(JourneyType),
    __metadata("design:type", Number)
], SegmentModel.prototype, "CabinClass", void 0);
class CityInfo {
}
exports.CityInfo = CityInfo;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CityInfo.prototype, "journyDate", void 0);
let Flight = class Flight {
};
exports.Flight = Flight;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Flight.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Flight.prototype, "AdultQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Flight.prototype, "ChildQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Flight.prototype, "InfantQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Flight.prototype, "EndUserIp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Flight.prototype, "JourneyType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Segment, (segment) => segment.flight, { cascade: true }),
    __metadata("design:type", Array)
], Flight.prototype, "Segments", void 0);
exports.Flight = Flight = __decorate([
    (0, typeorm_1.Entity)()
], Flight);
let Segment = class Segment {
};
exports.Segment = Segment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Segment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Segment.prototype, "Origin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Segment.prototype, "Destination", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Segment.prototype, "CabinClass", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Segment.prototype, "DepartureDateTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Flight, (flight) => flight.Segments),
    __metadata("design:type", Flight)
], Segment.prototype, "flight", void 0);
exports.Segment = Segment = __decorate([
    (0, typeorm_1.Entity)()
], Segment);
//# sourceMappingURL=flight.model.js.map