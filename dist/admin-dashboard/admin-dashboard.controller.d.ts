import { AdminDashboardService } from './admin-dashboard.service';
export declare class AdminDashboardController {
    private readonly adminDashboardService;
    constructor(adminDashboardService: AdminDashboardService);
    findAllDeposit(date: string): Promise<{
        Booking: {
            IssueInProcess: number;
            Booked: number;
            Cancelled: number;
            Ticketed: number;
            Flydetails: import("../book/booking.model").BookingSave[];
        };
        Deposit: {
            pending: number;
            TotalDeposit: number;
        };
    }>;
}
