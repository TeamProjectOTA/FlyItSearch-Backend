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
            TodayFly: number;
            TomorrowFly: number;
            DayAfterTomorrowFly: number;
        };
        Deposit: {
            pending: number;
            TotalDeposit: number;
        };
    }>;
}
