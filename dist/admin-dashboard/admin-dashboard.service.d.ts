import { BookingSave } from 'src/book/booking.model';
import { Repository } from 'typeorm';
import { Deposit } from 'src/deposit/deposit.model';
export declare class AdminDashboardService {
    private readonly bookingSaveRepository;
    private readonly depositRepository;
    constructor(bookingSaveRepository: Repository<BookingSave>, depositRepository: Repository<Deposit>);
    findAll(depositDate: string): Promise<{
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
