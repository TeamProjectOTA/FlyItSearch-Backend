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
            Flydetails: BookingSave[];
        };
        Deposit: {
            pending: number;
            TotalDeposit: number;
        };
    }>;
}
