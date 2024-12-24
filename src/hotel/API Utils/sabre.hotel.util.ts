import { Injectable } from "@nestjs/common";


@Injectable()
export class SabreHotelUtils{

    async  dataTransformer(data:any) {
     return data
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
    


}