"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHotelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_hotel_dto_1 = require("./create-hotel.dto");
class UpdateHotelDto extends (0, swagger_1.PartialType)(create_hotel_dto_1.CreateHotelDto) {
}
exports.UpdateHotelDto = UpdateHotelDto;
//# sourceMappingURL=update-hotel.dto.js.map