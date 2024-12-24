"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SabreHotelUtils = void 0;
const common_1 = require("@nestjs/common");
let SabreHotelUtils = class SabreHotelUtils {
    async dataTransformer(data) {
        return data;
        const transformedData = {
            hotelAvailInfo: data.HotelAvailInfo.map(hotel => ({
                hotelName: hotel.HotelInfo.HotelName || null,
                hotelCode: hotel.HotelInfo.HotelCode || null,
                address: hotel.HotelInfo.LocationInfo.Address.AddressLine1 || null,
                city: hotel.HotelInfo.LocationInfo.CityName?.value || null,
                country: hotel.HotelInfo.LocationInfo.CountryName?.value || null,
                postalCode: hotel.HotelInfo.LocationInfo.Address.PostalCode || null,
                phone: hotel.HotelInfo.LocationInfo.Contact.Phone || null,
                fax: hotel.HotelInfo.LocationInfo.Contact.Fax || null,
                hotelLogo: hotel.HotelInfo.Logo || null,
                rating: hotel.HotelInfo.SabreRating || null,
                distance: hotel.HotelInfo.Distance || null,
                direction: hotel.HotelInfo.Direction || null,
                amenities: hotel.HotelInfo.Amenities.Amenity?.map(amenity => amenity.Description) || [],
                roomRates: hotel.HotelRateInfo.RateInfos?.ConvertedRateInfo?.map(rate => ({
                    startDate: rate.StartDate || null,
                    endDate: rate.EndDate || null,
                    amountBeforeTax: rate.AmountBeforeTax || null,
                    amountAfterTax: rate.AmountAfterTax || null,
                    averageNightlyRate: rate.AverageNightlyRate || null,
                    currencyCode: rate.CurrencyCode || null
                })) || [],
                imageUrl: hotel.HotelImageInfo?.ImageItem?.Image?.Url || null,
                imageHeight: hotel.HotelImageInfo?.ImageItem?.Image?.Height || null,
                imageWidth: hotel.HotelImageInfo?.ImageItem?.Image?.Width || null
            }))
        };
        return transformedData;
    }
};
exports.SabreHotelUtils = SabreHotelUtils;
exports.SabreHotelUtils = SabreHotelUtils = __decorate([
    (0, common_1.Injectable)()
], SabreHotelUtils);
//# sourceMappingURL=sabre.hotel.util.js.map