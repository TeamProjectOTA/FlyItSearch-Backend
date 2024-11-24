export declare class vendorTicket {
    bookingId: string;
    airlinesPNR: string;
    vendorAmount: number;
    profit: number;
    vendorName: string;
    segmentCount: string;
    ticketNumber: [{
        index: number;
        eticket: number;
    }];
}
export declare class NewTicket {
    id: number;
    gdsPNR: string;
    bookingId: string;
    airlinesPNR: string;
    vendorName: string;
    loss_profit: string;
    segmentCount: string;
    flyHubPNR: string;
    dealAmount: number;
    inVoiceAmount: number;
    ticket: any;
}
