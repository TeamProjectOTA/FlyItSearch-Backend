import { AdminDashboardService } from './admin-dashboard.service';
import { NewTicket, vendorTicket } from './admin-dashboard.model';
export declare class AdminDashboardController {
    private readonly adminDashboardService;
    constructor(adminDashboardService: AdminDashboardService);
    findAllDeposit(startDate: string, endDate: string): Promise<{
        Booking: {
            IssueInProcess: number;
            Booked: number;
            Cancelled: number;
            Ticketed: number;
            TodayFly: number;
            TomorrowFly: number;
            DayAfterTomorrowFly: number;
        };
        Deposit: {
            pending: number;
            TotalDeposit: number;
        };
    }>;
    createTicket(ticketDataDTO: vendorTicket): Promise<import("../book/booking.model").BookingSave>;
    getAllTickets(): Promise<NewTicket[]>;
}
