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
exports.SabreService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const base64 = require("base-64");
const dotenv = require("dotenv");
const booking_service_1 = require("./booking.service");
dotenv.config();
let SabreService = class SabreService {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async restToken() {
        const client_id_raw = `V1:${process.env.SABRE_ID}:${process.env.SABRE_PCC}:AA`;
        const client_id = base64.encode(client_id_raw);
        const client_secret = base64.encode(process.env.SABRE_PASSWORD);
        const token = base64.encode(`${client_id}:${client_secret}`);
        const data = 'grant_type=client_credentials';
        const headers = {
            Authorization: `Basic ${token}`,
            Accept: '/',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        try {
            const response = await axios_1.default.post(process.env.SABRE_AUTH_ENDPOINT, data, {
                headers,
            });
            const result = response?.data;
            return result['access_token'];
        }
        catch (err) {
            console.log(err);
        }
    }
    async sabreCreateSessionSoap() {
        const payload = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header>
          <MessageHeader xmlns="http://www.ebxml.org/namespaces/messageHeader">
              <From>
                  <PartyId>${process.env.AGENCY_NAME}</PartyId>
              </From>
              <To>
                  <PartyId>Sabre_API</PartyId>
              </To>
              <ConversationId>2021.01.DevStudio</ConversationId>
              <Action>SessionCreateRQ</Action>
          </MessageHeader>
          <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
              <UsernameToken>
                  <Username>${process.env.SABRE_ID}</Username>
                  <Password>${process.env.SABRE_PASSWORD}</Password>
                  <Organization>${process.env.SABRE_PCC}</Organization>
                  <Domain>DEFAULT</Domain>
              </UsernameToken>
          </Security>
      </SOAP-ENV:Header>
      <SOAP-ENV:Body>
        <SessionCreateRQ returnContextID="true" Version="1.0.0" xmlns="http://www.opentravel.org/OTA/2002/11"/>
      </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;
        let sabretokenRq = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_WEBSERVICES_ENDPOINT,
            headers: {
                'Content-Type': 'text/xml',
                'Conversation-ID': '2021.01.DevStudio',
            },
            data: payload,
        };
        try {
            const response = await axios_1.default.request(sabretokenRq);
            return response.data;
        }
        catch (error) {
            return 'Token error';
        }
    }
    async sabreSessionLessTokenSoap() {
        const payload = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header>
          <MessageHeader xmlns="http://www.ebxml.org/namespaces/messageHeader">
              <From>
                  <PartyId>${process.env.AGENCY_NAME}</PartyId>
              </From>
              <To>
                  <PartyId>Sabre_API</PartyId>
              </To>
              <ConversationId>2021.01.DevStudio</ConversationId>
              <Action>TokenCreateRQ</Action>
          </MessageHeader>
          <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
              <UsernameToken>
                  <Username>${process.env.SABRE_ID}</Username>
                  <Password>${process.env.SABRE_PASSWORD}</Password>
                  <Organization>${process.env.SABRE_PCC}</Organization>
                  <Domain>DEFAULT</Domain>
              </UsernameToken>
          </Security>
      </SOAP-ENV:Header>
      <SOAP-ENV:Body>
        <TokenCreateRQ Version="1.0.0" xmlns="http://webservices.sabre.com"/>
      </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;
        let sabretokenRq = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_WEBSERVICES_ENDPOINT,
            headers: {
                'Content-Type': 'text/xml',
                'Conversation-ID': '2021.01.DevStudio',
            },
            data: payload,
        };
        try {
            const response = await axios_1.default.request(sabretokenRq);
            return response?.data;
        }
        catch (error) {
            return 'Token error';
        }
    }
    async closeSession() {
        const payload = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header>
          <MessageHeader xmlns="http://www.ebxml.org/namespaces/messageHeader">
              <From>
                  <PartyId>${process.env.AGENCY_NAME}</PartyId>
              </From>
              <To>
                  <PartyId>Sabre_API</PartyId>
              </To>
              <ConversationId>2021.01.DevStudio</ConversationId>
              <Action>SessionCreateRQ</Action>
          </MessageHeader>
          <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
              <UsernameToken>
                  <Username>${process.env.SABRE_ID}</Username>
                  <Password>${process.env.SABRE_PASSWORD}</Password>
                  <Organization>${process.env.SABRE_PCC}</Organization>
                  <Domain>DEFAULT</Domain>
              </UsernameToken>
          </Security>
      </SOAP-ENV:Header>
      <SOAP-ENV:Body>
        <SessionCloseRQ Version="1.0.0" xmlns="http://www.opentravel.org/OTA/2002/11"/>
      </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;
        let sabretokenRq = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_WEBSERVICES_ENDPOINT,
            headers: {
                'Content-Type': 'text/xml',
                'Conversation-ID': '2021.01.DevStudio',
            },
            data: payload,
        };
        try {
            const response = await axios_1.default.request(sabretokenRq);
            return response;
        }
        catch (error) {
            return 'Token error';
        }
    }
    async shoppingBranded(flightDto) {
        let adultCount = flightDto?.adultcount || 1;
        let childCount = flightDto?.childcount || 0;
        let infantCount = flightDto?.infantcount || 0;
        let cabinclass = flightDto.cabinclass;
        let segments = flightDto.segments;
        const SabreRequestPax = [];
        if (adultCount > 0) {
            const PaxQuantity = {
                Code: 'ADT',
                Quantity: adultCount,
            };
            SabreRequestPax.push(PaxQuantity);
        }
        if (childCount > 0) {
            const PaxQuantity = {
                Code: 'CNN',
                Quantity: childCount,
            };
            SabreRequestPax.push(PaxQuantity);
        }
        if (infantCount > 0) {
            const PaxQuantity = {
                Code: 'INF',
                Quantity: infantCount,
            };
            SabreRequestPax.push(PaxQuantity);
        }
        const IncludeVendorPref = [
            { Code: 'BG' },
            { Code: 'EK' },
            { Code: 'SQ' },
            { Code: 'BS' },
            { Code: 'TK' },
            { Code: 'QR' },
            { Code: 'GF' },
            { Code: 'SV' },
            { Code: 'KU' },
            { Code: 'CX' },
            { Code: 'UL' },
            { Code: 'AI' },
            { Code: 'TG' },
            {
                Code: 'UK',
            },
            { Code: 'MH' },
            { Code: 'WY' },
            { Code: 'FZ' },
        ];
        const SegmentList = [];
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const DepFrom = segment.depfrom;
            const ArrTo = segment.arrto;
            const DepDate = segment.depdate + 'T00:00:00';
            const SingleSegment = {
                RPH: i.toString(),
                DepartureDateTime: DepDate,
                OriginLocation: {
                    LocationCode: DepFrom,
                },
                DestinationLocation: {
                    LocationCode: ArrTo,
                    LocationType: 'C',
                    AllAirports: true,
                },
                TPA_Extensions: {
                    IncludeVendorPref: IncludeVendorPref,
                },
            };
            SegmentList.push(SingleSegment);
        }
        const sabreToken = await this.restToken();
        let payload_data = {
            OTA_AirLowFareSearchRQ: {
                OriginDestinationInformation: SegmentList,
                POS: {
                    Source: [
                        {
                            PseudoCityCode: process.env.SABRE_PCC,
                            RequestorID: {
                                Type: '1',
                                ID: '1',
                                CompanyName: {
                                    Code: 'TN',
                                },
                            },
                        },
                    ],
                },
                AvailableFlightsOnly: true,
                SeparateMessages: true,
                TPA_Extensions: {
                    IntelliSellTransaction: {
                        RequestType: {
                            Name: '50ITINS',
                        },
                    },
                    RichContent: {
                        FlightAmenities: true,
                        SeatInfo: true,
                        UniversalProductAttributes: true,
                        UniversalTicketingAttributes: true,
                    },
                },
                TravelerInfoSummary: {
                    AirTravelerAvail: [
                        {
                            PassengerTypeQuantity: SabreRequestPax,
                        },
                    ],
                    PriceRequestInformation: {
                        CurrencyCode: 'BDT',
                        TPA_Extensions: {
                            PrivateFare: {
                                Ind: false,
                            },
                            PublicFare: {
                                Ind: false,
                            },
                            BrandedFareIndicators: {
                                MultipleBrandedFares: true,
                                ReturnBrandAncillaries: true,
                                UpsellLimit: 2,
                            },
                        },
                    },
                    SeatsRequested: [flightDto.adultcount + flightDto.childcount],
                },
                TravelPreferences: {
                    TPA_Extensions: {
                        CodeShareIndicator: {
                            ExcludeCodeshare: true,
                            KeepOnlines: true,
                        },
                        OnlineIndicator: {
                            Ind: false,
                        },
                        PreferNDCSourceOnTie: {
                            Value: false,
                        },
                        XOFares: {
                            Value: true,
                        },
                        DataSources: {
                            NDC: 'Disable',
                            ATPCO: 'Enable',
                            LCC: 'Disable',
                        },
                        LongConnectTime: {
                            Min: 59,
                            Max: 1439,
                            Enable: true,
                        },
                    },
                    AncillaryFees: {
                        AncillaryFeeGroup: [
                            {
                                Code: 'BG',
                            },
                            {
                                Code: 'ST',
                            },
                            {
                                Code: 'ML',
                            },
                        ],
                        Enable: true,
                        Summary: true,
                    },
                    Baggage: {
                        Description: true,
                        CarryOnInfo: true,
                        FreeCarryOn: true,
                        FreePieceRequired: true,
                        RequestType: 'C',
                        RequestedPieces: 1,
                    },
                    FlightTypePref: {
                        MaxConnections: '4',
                    },
                    CabinPref: [
                        {
                            Cabin: cabinclass,
                            PreferLevel: 'Preferred',
                        },
                    ],
                },
                Version: '5',
            },
        };
        const shoppingrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRSEARCH_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload_data,
        };
        try {
            const response = await axios_1.default.request(shoppingrequest);
            return response.data;
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async revalidation(revalidationDto) {
        let AdultCount = 0;
        let ChildCount = 0;
        let InfantCount = 0;
        const PriceBreakDown = revalidationDto.PriceBreakDown;
        for (const pricebreakdown of PriceBreakDown) {
            if (pricebreakdown.PaxType === 'ADT') {
                AdultCount = pricebreakdown.PaxCount;
            }
            else if (pricebreakdown.PaxType === 'CNN') {
                ChildCount = pricebreakdown.PaxCount;
            }
            else if (pricebreakdown.PaxType === 'INF') {
                InfantCount = pricebreakdown.PaxCount;
            }
            else {
                throw new Error('Invalid Price Break down');
            }
        }
        const SabreRequestPax = [];
        if (AdultCount > 0) {
            SabreRequestPax.push({
                Code: 'ADT',
                Quantity: AdultCount,
            });
        }
        if (ChildCount > 0) {
            SabreRequestPax.push({
                Code: 'CNN',
                Quantity: ChildCount,
            });
        }
        if (InfantCount > 0) {
            SabreRequestPax.push({
                Code: 'INF',
                Quantity: InfantCount,
            });
        }
        let SeatReq = AdultCount + ChildCount;
        const RequestArray = [];
        const AllSegments = revalidationDto.AllLegsInfo;
        for (const segments of AllSegments) {
            for (let i = 0; i < segments.Segments.length; i++) {
                const segment = segments.Segments[i];
                const MarketingCarrier = segment.MarketingCarrier;
                const MarketingFlightNumber = segment.MarketingFlightNumber;
                const OperatingCarrier = segment.OperatingCarrier;
                const DepFrom = segment.DepFrom;
                const ArrTo = segment.ArrTo;
                const DepTime = segment.DepTime.slice(0, 19);
                const ArrTime = segment.ArrTime.slice(0, 19);
                const BookingCode = segment.SegmentCode.bookingCode;
                const MultiRequest = {
                    RPH: String(i + 1),
                    DepartureDateTime: DepTime,
                    OriginLocation: {
                        LocationCode: DepFrom,
                    },
                    DestinationLocation: {
                        LocationCode: ArrTo,
                    },
                    TPA_Extensions: {
                        SegmentType: {
                            Code: 'O',
                        },
                        Flight: [
                            {
                                Number: MarketingFlightNumber,
                                DepartureDateTime: DepTime,
                                ArrivalDateTime: ArrTime,
                                Type: 'A',
                                ClassOfService: BookingCode,
                                OriginLocation: {
                                    LocationCode: DepFrom,
                                },
                                DestinationLocation: {
                                    LocationCode: ArrTo,
                                },
                                Airline: {
                                    Operating: OperatingCarrier,
                                    Marketing: MarketingCarrier,
                                },
                            },
                        ],
                    },
                };
                RequestArray.push(MultiRequest);
            }
        }
        const sabre_revalidation_request_data = {
            OTA_AirLowFareSearchRQ: {
                Version: '4',
                TravelPreferences: {
                    TPA_Extensions: {
                        VerificationItinCallLogic: {
                            Value: 'B',
                        },
                    },
                },
                TravelerInfoSummary: {
                    SeatsRequested: [SeatReq],
                    AirTravelerAvail: [
                        {
                            PassengerTypeQuantity: SabreRequestPax,
                        },
                    ],
                },
                POS: {
                    Source: [
                        {
                            PseudoCityCode: process.env.SABRE_PCC,
                            RequestorID: {
                                Type: '1',
                                ID: '1',
                                CompanyName: {
                                    Code: 'TN',
                                },
                            },
                        },
                    ],
                },
                OriginDestinationInformation: RequestArray,
                TPA_Extensions: {
                    IntelliSellTransaction: {
                        RequestType: {
                            Name: '100ITINS',
                        },
                    },
                },
            },
        };
        const sabreToken = await this.restToken();
        let sabreflightrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRPRICE_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: sabre_revalidation_request_data,
        };
        try {
            const revalidation_response = await axios_1.default.request(sabreflightrequest);
            const RevalidationResponse = revalidation_response.data;
            return RevalidationResponse;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async price_check(agentdata, flightInfo) {
        return [{ IsBookable: true }];
    }
    async booking(bookingDto) {
        const agentdata = [{ name: 'hasibul', age: 10 }];
        const priceCheck = await this.price_check(agentdata, bookingDto.FlightInfo);
        if (priceCheck[0].IsBookable === false) {
            return this.bookingService.createBooking(agentdata, '', bookingDto, priceCheck[0]);
        }
        const time_now = new Date();
        const email = bookingDto.ContactInfo.email || 'dev@flyjatt.com';
        const leadPassengerEmail = email.replace('@', '//');
        const phone = bookingDto.ContactInfo.phone || '08801685370455';
        const adult = bookingDto.PassengerInfo.adult.length;
        const child = bookingDto.PassengerInfo.child.length || 0;
        const infant = bookingDto.PassengerInfo.infant.length || 0;
        let AllPerson = [];
        let AdvancePassenger = [];
        let SecureFlight = [];
        let AllSsr = [];
        let PaxInfo = [];
        if (adult > 0 && child > 0 && infant > 0) {
            PaxInfo = [
                {
                    Code: 'ADT',
                    Quantity: adult.toString(),
                },
                {
                    Code: 'C04',
                    Quantity: child.toString(),
                },
                {
                    Code: 'INF',
                    Quantity: infant.toString(),
                },
            ];
            let adultCount = 0;
            let totalCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo?.adult) {
                adultCount++;
                totalCount++;
                const givenname = adultPax?.givenname.toUpperCase();
                const surname = adultPax?.surname.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let title;
                if (gender === 'MALE') {
                    gender = 'M';
                    title = 'MR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    title = 'MS';
                }
                const Person = {
                    NameNumber: `${totalCount}.1`,
                    GivenName: `${givenname} ${title}`,
                    Surname: surname,
                    Infant: false,
                    PassengerType: 'ADT',
                    NameReference: '',
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'OTHS',
                    Text: `CC ${givenname} ${surname}`,
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
                const SSRCTCM = {
                    SSR_Code: 'CTCM',
                    Text: phone,
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCM);
                const SSRCTCE = {
                    SSR_Code: 'CTCE',
                    Text: leadPassengerEmail,
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCE);
            }
            let childCount = 0;
            for (const childPax of bookingDto?.PassengerInfo?.child) {
                adultCount++;
                childCount++;
                totalCount++;
                const givenname = childPax?.givenname?.toUpperCase();
                const surname = childPax?.surname?.toUpperCase();
                let gender = childPax?.gender?.toUpperCase();
                const dob = childPax?.dob;
                const document = childPax?.document?.toUpperCase();
                const expiredate = childPax?.expiredate;
                const nationality = childPax?.nationality?.toUpperCase();
                const cdate = new Date(dob);
                const year = cdate.getFullYear().toString().slice(-2);
                const month = cdate.toLocaleString('en-US', { month: 'short' });
                const day = cdate.getDate().toString().padStart(2, '0');
                const childSSR = `${day}${month}${year}`;
                const cAge = time_now.getFullYear() - cdate.getFullYear();
                let ctitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    ctitle = 'MSTR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    ctitle = 'MISS';
                }
                const Person = {
                    NameNumber: `${totalCount}.1`,
                    GivenName: `${givenname} ${ctitle}`,
                    Surname: surname,
                    Infant: false,
                    PassengerType: `C${String(cAge).padStart(2, '0')}`,
                    NameReference: `C${String(cAge).padStart(2, '0')}`,
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'CHLD',
                    Text: childSSR,
                    PersonName: {
                        NameNumber: `${totalCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
            }
            let infantCount = 0;
            for (const infantPax of bookingDto?.PassengerInfo?.infant) {
                adultCount++;
                infantCount++;
                totalCount++;
                const givenname = infantPax?.givenname.toUpperCase();
                const surname = infantPax?.surname.toUpperCase();
                let gender = infantPax?.gender?.toUpperCase();
                const dob = infantPax?.dob;
                const document = infantPax.document?.toUpperCase();
                const expiredate = infantPax.expiredate;
                const nationality = infantPax.nationality.toUpperCase();
                const idate = new Date(dob);
                const year = idate.getFullYear().toString().slice(-2);
                const month = idate.toLocaleString('en-US', { month: 'short' });
                const day = idate.getDate().toString().padStart(2, '0');
                const infantSSR = `${day}${month}${year}`;
                const iAge = Math.ceil(time_now.getFullYear() - idate.getFullYear()) * 12 +
                    (time_now.getMonth() - idate.getMonth());
                let title;
                if (gender === 'MALE') {
                    gender = 'M';
                    title = 'MSTR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    title = 'MISS';
                }
                const Person = {
                    NameNumber: `${totalCount}.1`,
                    GivenName: `${givenname} ${title}`,
                    Surname: surname,
                    Infant: true,
                    PassengerType: 'INF',
                    NameReference: `I${String(iAge).padStart(2, '0')}`,
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${infantCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: `${gender}I`,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${infantCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: `${gender}I`,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'INFT',
                    Text: `${givenname}/${surname} ${title}/${infantSSR}`,
                    PersonName: {
                        NameNumber: `${infantCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
            }
        }
        else if (adult > 0 && child > 0) {
            PaxInfo = [
                {
                    Code: 'ADT',
                    Quantity: adult.toString(),
                },
                {
                    Code: 'C05',
                    Quantity: child.toString(),
                },
            ];
            let adultCount = 0;
            let childCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo?.adult) {
                adultCount++;
                const givenname = adultPax?.givenname?.toUpperCase();
                const surname = adultPax?.surname?.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let atitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    atitle = 'MR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    atitle = 'MS';
                }
                const Person = {
                    NameNumber: `${adultCount}.1`,
                    GivenName: `${givenname} ${atitle}`,
                    Surname: surname,
                    Infant: false,
                    PassengerType: 'ADT',
                    NameReference: '',
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'OTHS',
                    Text: `CC ${givenname} ${givenname}`,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
                const SSRCTCM = {
                    SSR_Code: 'CTCM',
                    Text: phone,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCM);
                const SSRCTCE = {
                    SSR_Code: 'CTCE',
                    Text: leadPassengerEmail,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCE);
            }
            for (const childPax of bookingDto?.PassengerInfo?.child) {
                adultCount++;
                childCount++;
                const givenname = childPax?.givenname?.toUpperCase();
                const surname = childPax?.surname?.toUpperCase();
                let gender = childPax?.gender?.toUpperCase();
                const dob = childPax?.dob;
                const document = childPax?.document?.toUpperCase();
                const expiredate = childPax?.expiredate;
                const nationality = childPax?.nationality?.toUpperCase();
                const cdate = new Date(dob);
                const year = cdate.getFullYear().toString().slice(-2);
                const month = cdate.toLocaleString('en-US', { month: 'short' });
                const day = cdate.getDate().toString().padStart(2, '0');
                const childSSR = `${day}${month}${year}`;
                const cAge = time_now.getFullYear() - cdate.getFullYear();
                let ctitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    ctitle = 'MSTR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    ctitle = 'MISS';
                }
                const Person = {
                    NameNumber: `${adultCount}.1`,
                    GivenName: `${givenname} ${ctitle}`,
                    Surname: surname,
                    Infant: false,
                    PassengerType: `C${String(cAge).padStart(2, '0')}`,
                    NameReference: `C${String(cAge).padStart(2, '0')}`,
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'CHLD',
                    Text: childSSR,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
            }
        }
        else if (adult > 0 && infant > 0) {
            PaxInfo = [
                {
                    Code: 'ADT',
                    Quantity: adult.toString(),
                },
                {
                    Code: 'INF',
                    Quantity: infant.toString(),
                },
            ];
            let adultCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo?.adult) {
                adultCount++;
                const givenname = adultPax?.givenname.toUpperCase();
                const surname = adultPax?.surname?.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let atitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    atitle = 'MR';
                }
                else if (gender === 'MALE') {
                    gender = 'F';
                    atitle = 'MS';
                }
                const Person = {
                    NameNumber: `${adultCount}.1`,
                    GivenName: `${givenname} ${atitle}`,
                    Surname: surname,
                    Infant: false,
                    PassengerType: 'ADT',
                    NameReference: '',
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'OTHS',
                    Text: `CC ${givenname} ${givenname}`,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
                const SSRCTCM = {
                    SSR_Code: 'CTCM',
                    Text: phone,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCM);
                const SSRCTCE = {
                    SSR_Code: 'CTCE',
                    Text: leadPassengerEmail,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCE);
            }
            let infantCount = 0;
            for (const infantPax of bookingDto?.PassengerInfo?.infant) {
                adultCount++;
                infantCount++;
                const givenname = infantPax?.givenname?.toUpperCase();
                const surname = infantPax?.surname?.toUpperCase();
                let gender = infantPax?.gender?.toUpperCase();
                const dob = infantPax?.dob;
                const document = infantPax?.document?.toUpperCase();
                const expiredate = infantPax?.expiredate;
                const nationality = infantPax?.nationality?.toUpperCase();
                const idate = new Date(dob);
                const year = idate.getFullYear().toString().slice(-2);
                const month = idate.toLocaleString('en-US', { month: 'short' });
                const day = idate.getDate().toString().padStart(2, '0');
                const infantSSR = `${day}${month}${year}`;
                const iAge = Math.ceil(time_now.getFullYear() - idate.getFullYear()) * 12 +
                    (time_now.getMonth() - idate.getMonth());
                let ititle;
                if (gender === 'MALE') {
                    gender = 'M';
                    ititle = 'MSTR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    ititle = 'MISS';
                }
                const Person = {
                    NameNumber: `${adultCount}.1`,
                    GivenName: `${givenname} ${ititle}`,
                    Surname: surname,
                    Infant: true,
                    PassengerType: 'INF',
                    NameReference: `I${String(iAge).padStart(2, '0')}`,
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${infantCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: `${gender}I`,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${infantCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: `${gender}I`,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'INFT',
                    Text: `${givenname}/${surname} ${ititle}/${infantSSR}`,
                    PersonName: {
                        NameNumber: `${infantCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
            }
        }
        else {
            PaxInfo = [
                {
                    Code: 'ADT',
                    Quantity: adult.toString(),
                },
            ];
            let adultCount = 0;
            for (const adultPax of bookingDto?.PassengerInfo.adult) {
                adultCount++;
                const givenname = adultPax?.givenname?.toUpperCase();
                const surname = adultPax?.surname?.toUpperCase();
                let gender = adultPax?.gender?.toUpperCase();
                const dob = adultPax?.dob;
                const document = adultPax?.document?.toUpperCase();
                const expiredate = adultPax?.expiredate;
                const nationality = adultPax?.nationality?.toUpperCase();
                let atitle;
                if (gender === 'MALE') {
                    gender = 'M';
                    atitle = 'MR';
                }
                else if (gender === 'FEMALE') {
                    gender = 'F';
                    atitle = 'MS';
                }
                const Person = {
                    NameNumber: `${adultCount}.1`,
                    GivenName: `${givenname} ${atitle}`,
                    Surname: surname,
                    Infant: false,
                    PassengerType: 'ADT',
                    NameReference: '',
                };
                AllPerson.push(Person);
                const AdvPax = {
                    Document: {
                        Number: document,
                        IssueCountry: nationality,
                        NationalityCountry: nationality,
                        ExpirationDate: expiredate,
                        Type: 'P',
                    },
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        MiddleName: '',
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                AdvancePassenger.push(AdvPax);
                const secureFlightPax = {
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                        GivenName: givenname,
                        Surname: surname,
                        DateOfBirth: dob,
                        Gender: gender,
                    },
                    SegmentNumber: 'A',
                };
                SecureFlight.push(secureFlightPax);
                const SSROThers = {
                    SSR_Code: 'OTHS',
                    Text: `CC ${givenname} ${givenname}`,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSROThers);
                const SSRCTCM = {
                    SSR_Code: 'CTCM',
                    Text: phone,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCM);
                const SSRCTCE = {
                    SSR_Code: 'CTCE',
                    Text: leadPassengerEmail,
                    PersonName: {
                        NameNumber: `${adultCount}.1`,
                    },
                    SegmentNumber: 'A',
                };
                AllSsr.push(SSRCTCE);
            }
        }
        const flightData = bookingDto.FlightInfo.AllLegsInfo;
        const seatReq = adult + child;
        let FlightSegment = [];
        for (let sgFlight of flightData) {
            for (let flight of sgFlight.Segments) {
                const depFrom = flight.DepFrom;
                const arrTo = flight.ArrTo;
                const depTime = flight.DepTime.substr(0, 19);
                const arrTime = flight.ArrTime.substr(0, 19);
                const bookingCode = flight.SegmentCode.bookingCode;
                const marketingCarrier = flight.MarketingCarrier;
                const marketingFlightNumber = flight.MarketingFlightNumber;
                const availabilityBreak = flight.SegmentCode.availabilityBreak;
                let marrigegroup = 'O';
                if (availabilityBreak === true) {
                    marrigegroup = 'I';
                }
                const singleSegment = {
                    DepartureDateTime: depTime,
                    ArrivalDateTime: arrTime,
                    FlightNumber: marketingFlightNumber.toString(),
                    NumberInParty: seatReq.toString(),
                    ResBookDesigCode: bookingCode,
                    Status: 'NN',
                    OriginLocation: {
                        LocationCode: depFrom,
                    },
                    DestinationLocation: {
                        LocationCode: arrTo,
                    },
                    MarketingAirline: {
                        Code: marketingCarrier,
                        FlightNumber: marketingFlightNumber.toString(),
                    },
                    MarriageGrp: marrigegroup,
                };
                FlightSegment.push(singleSegment);
            }
        }
        const sabre_booking_request = {
            CreatePassengerNameRecordRQ: {
                targetCity: process.env.SABRE_PCC,
                haltOnAirPriceError: true,
                TravelItineraryAddInfo: {
                    AgencyInfo: {
                        Address: {
                            AddressLine: process.env.AGENCY_NAME,
                            CityName: process.env.SABRE_CITY_NAME,
                            CountryCode: process.env.SABRE_PCC_COUNTRY,
                            PostalCode: process.env.SABRE_POSTAL_CODE,
                            StateCountyProv: {
                                StateCode: process.env.SABRE_STATE_CODE,
                            },
                            StreetNmbr: process.env.SABRE_AGENCY_STNO,
                        },
                        Ticketing: {
                            TicketType: '7TAW',
                        },
                    },
                    CustomerInfo: {
                        ContactNumbers: {
                            ContactNumber: [
                                {
                                    NameNumber: '1.1',
                                    Phone: phone,
                                    PhoneUseType: 'H',
                                },
                            ],
                        },
                        Email: [
                            {
                                NameNumber: '1.1',
                                Address: email,
                                Type: 'CC',
                            },
                        ],
                        PersonName: AllPerson,
                    },
                },
                AirBook: {
                    HaltOnStatus: [
                        { Code: 'HL' },
                        { Code: 'KK' },
                        { Code: 'LL' },
                        { Code: 'NN' },
                        { Code: 'NO' },
                        { Code: 'UC' },
                        { Code: 'US' },
                    ],
                    OriginDestinationInformation: {
                        FlightSegment: FlightSegment,
                    },
                    RedisplayReservation: {
                        NumAttempts: 10,
                        WaitInterval: 300,
                    },
                },
                AirPrice: [
                    {
                        PriceRequestInformation: {
                            Retain: true,
                            OptionalQualifiers: {
                                FOP_Qualifiers: {
                                    BasicFOP: {
                                        Type: 'CASH',
                                    },
                                },
                                PricingQualifiers: {
                                    PassengerType: PaxInfo,
                                },
                            },
                        },
                    },
                ],
                SpecialReqDetails: {
                    SpecialService: {
                        SpecialServiceInfo: {
                            AdvancePassenger: AdvancePassenger,
                            SecureFlight: SecureFlight,
                            Service: AllSsr,
                        },
                    },
                },
                PostProcessing: {
                    EndTransaction: {
                        Source: {
                            ReceivedFrom: 'API WEB',
                        },
                        Email: {
                            Ind: true,
                        },
                    },
                    RedisplayReservation: {
                        waitInterval: 1000,
                    },
                },
            },
        };
        const sabreToken = await this.restToken();
        let sabrebookingrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRBOOKING_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: sabre_booking_request,
        };
        try {
            const response = await axios_1.default.request(sabrebookingrequest);
            return response;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async aircancel(pnr) {
        const payload = {
            confirmationId: pnr,
            retrieveBooking: true,
            cancelAll: true,
            errorHandlingPolicy: 'ALLOW_PARTIAL_CANCEL',
        };
        const sabreToken = await this.restToken();
        let sabrecancelrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRCANCEL_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload,
        };
        try {
            const aircancel_response = await axios_1.default.request(sabrecancelrequest);
            const CancelResponse = aircancel_response.data;
            return CancelResponse;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airretrieve(pnr) {
        const payload = {
            confirmationId: pnr,
        };
        const sabreToken = await this.restToken();
        let sabreflightrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRRETRIEVE_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload,
        };
        try {
            const get_booking_response = await axios_1.default.request(sabreflightrequest);
            return get_booking_response.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async checkpnr(pnr) {
        const payload = {
            confirmationId: pnr,
        };
        const sabreToken = await this.restToken();
        let sabreflightrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRRETRIEVE_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload,
        };
        try {
            const get_booking_response = await axios_1.default.request(sabreflightrequest);
            return get_booking_response.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airticketing(BookingData) {
        const adult = BookingData.adultcount;
        const child = BookingData.childcount;
        const infant = BookingData.infantcount;
        const pnr = BookingData.pnr;
        let passengerArray = [];
        if (adult > 0 && child > 0 && infant > 0) {
            passengerArray = [{ Number: 1 }, { Number: 2 }, { Number: 3 }];
        }
        else if (adult > 0 && child == 0) {
            passengerArray = [{ Number: 1 }];
        }
        else if (adult > 0 && child > 0) {
            passengerArray = [{ Number: 1 }, { Number: 2 }];
        }
        else if (adult > 0 && infant > 0) {
            passengerArray = [{ Number: 1 }, { Number: 2 }];
        }
        const payload = {
            AirTicketRQ: {
                version: '1.3.0',
                targetCity: process.env.SABRE_PCC,
                DesignatePrinter: {
                    Printers: {
                        Ticket: {
                            CountryCode: process.env.SABRE_PCC_COUNTRY,
                        },
                        Hardcopy: {
                            LNIATA: process.env.SABRE_LNIATA,
                        },
                        InvoiceItinerary: {
                            LNIATA: process.env.SABRE_LNIATA,
                        },
                    },
                },
                Itinerary: {
                    ID: pnr,
                },
                Ticketing: [
                    {
                        MiscQualifiers: {
                            Commission: {
                                Percent: 7,
                            },
                        },
                        PricingQualifiers: {
                            PriceQuote: [
                                {
                                    Record: passengerArray,
                                },
                            ],
                        },
                    },
                ],
                PostProcessing: {
                    EndTransaction: {
                        Source: {
                            ReceivedFrom: 'SABRE WEB',
                        },
                    },
                },
            },
        };
        const sabreToken = await this.restToken();
        let sabreissuerequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRTICKETING_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload,
        };
        try {
            const ticketing_response = await axios_1.default.request(sabreissuerequest);
            const get_ticket_data = ticketing_response.data;
            if (get_ticket_data.AirTicketRS.Summary) {
                const allticket_data = [];
                const extractedData = get_ticket_data.AirTicketRS.Summary.map((item) => {
                    const givenName = item.FirstName;
                    const surname = item.LastName;
                    const ticketNumber = item.DocumentNumber;
                    const ticketCopy = `${givenName}/${surname}-${ticketNumber}`;
                    allticket_data.push(ticketCopy);
                });
                BookingData['ticketcopy'] = allticket_data.join(' ,');
                BookingData['ticketed_at'] =
                    get_ticket_data.AirTicketRS.Summary[0].LocalIssueDateTime;
                BookingData['status'] = 'Ticketed';
                return get_ticket_data;
            }
            return get_ticket_data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airvoid(pnr) {
        const payload = {
            confirmationId: pnr,
            retrieveBooking: true,
            cancelAll: true,
            flightTicketOperation: 'VOID',
            errorHandlingPolicy: 'HALT_ON_ERROR',
        };
        const sabreToken = await this.restToken();
        let sabrevoidrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_AIRVOID_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload,
        };
        try {
            const void_response = await axios_1.default.request(sabrevoidrequest);
            const voidreponse = void_response.data;
            return voidreponse;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async airfarerules(farerulesDto) {
        const depdate = farerulesDto.DepDate;
        const origin = farerulesDto.Origin;
        const destination = farerulesDto.Destination;
        const carrier = farerulesDto.Carrier;
        const farebasiscode = farerulesDto.FareBasisCode;
        const sabreToken = await this.sabreCreateSessionSoap();
        const payload = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header>
          <MessageHeader xmlns="http://www.ebxml.org/namespaces/messageHeader">
              <From>
                  <PartyId>${process.env.AGENCY_NAME}</PartyId>
              </From>
              <To>
                  <PartyId>Sabre_API</PartyId>
              </To>
              <ConversationId>2021.01.DevStudio</ConversationId>
              <Action>OTA_AirRulesLLSRQ</Action>
          </MessageHeader>
          <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
              <wsse:BinarySecurityToken valueType="String" EncodingType="wsse:Base64Binary">${sabreToken}</wsse:BinarySecurityToken>
          </wsse:Security>
      </SOAP-ENV:Header>
      <SOAP-ENV:Body>
          <OTA_AirRulesRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
          <OriginDestinationInformation>
              <FlightSegment DepartureDateTime="${depdate}">
                  <DestinationLocation LocationCode="${destination}"/>
                  <MarketingCarrier Code="${carrier}"/>
                  <OriginLocation LocationCode="${origin}"/>
              </FlightSegment>
          </OriginDestinationInformation>
          <RuleReqInfo>
              <Category>16</Category>
              <Category>31</Category>
              <FareBasis Code="${farebasiscode}"/>
          </RuleReqInfo>
          </OTA_AirRulesRQ>
      </SOAP-ENV:Body>
  </SOAP-ENV:Envelope>`;
        let farerulesrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_WEBSERVICES_ENDPOINT,
            headers: {
                'Content-Type': 'text/xml',
                'Conversation-ID': '2021.01.DevStudio',
            },
            data: payload,
        };
        try {
            const response = await axios_1.default.request(farerulesrequest);
            return response;
        }
        catch (error) {
            return error.response?.data;
        }
    }
    async get_ticket(pnr) {
        const payload = { confirmationId: pnr };
        const sabreToken = await this.restToken();
        let sabreticketrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_CHECK_AIRTICKETING_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'Conversation-ID': '2021.01.DevStudio',
                Authorization: `Bearer ${sabreToken}`,
            },
            data: payload,
        };
        try {
            const checkticket_response = await axios_1.default.request(sabreticketrequest);
            const checkticket_result = checkticket_response.data;
            return checkticket_result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async seat_map(seatMapDto) {
        const sabreToken = await this.sabreCreateSessionSoap();
        const EnhancedSeatMapRQ = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header>
          <MessageHeader xmlns="http://www.ebxml.org/namespaces/messageHeader">
              <From>
                  <PartyId>${process.env.AGENCY_NAME}</PartyId>
              </From>
              <To>
                  <PartyId>Sabre_API</PartyId>
              </To>
              <ConversationId>2021.01.DevStudio</ConversationId>
              <Action>EnhancedSeatMapRQ</Action>
          </MessageHeader>
          <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
              <wsse:BinarySecurityToken valueType="String" EncodingType="wsse:Base64Binary">${sabreToken}</wsse:BinarySecurityToken>
          </wsse:Security>
          </SOAP-ENV:Header>
          <SOAP-ENV:Body>
          <EnhancedSeatMapRQ version="6.0.0" xmlns="http://stl.sabre.com/Merchandising/v5">
              <SeatMapQueryEnhanced>
                  <RequestType>Payload</RequestType>
                  <Flight destination="${seatMapDto.Destination}" origin="${seatMapDto.Origin}">
                      <DepartureDate>${seatMapDto.DepDate}</DepartureDate>
                      <Marketing carrier="${seatMapDto.Carrier}">${seatMapDto.FlightNumber}</Marketing>
                  </Flight>
                  <CabinDefinition>
                      <RBD>${seatMapDto.CabinClass}</RBD>
                  </CabinDefinition>
                  <POS>
                      <PCC>${process.env.SABRE_PCC}</PCC>
                  </POS>
              </SeatMapQueryEnhanced>
          </EnhancedSeatMapRQ>
          </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;
        let seatmaprequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.SABRE_WEBSERVICES_ENDPOINT,
            headers: {
                'Content-Type': 'text/xml',
                'Conversation-ID': '2021.01.DevStudio',
            },
            data: EnhancedSeatMapRQ,
        };
        try {
            const response = await axios_1.default.request(seatmaprequest);
            return response;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.SabreService = SabreService;
exports.SabreService = SabreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], SabreService);
//# sourceMappingURL=sabre.flights.service.js.map