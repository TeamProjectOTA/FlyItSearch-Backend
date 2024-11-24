import { BookingSave } from 'src/book/booking.model';
import { Repository } from 'typeorm';
import { Deposit } from 'src/deposit/deposit.model';
import { NewTicket, vendorTicket } from './admin-dashboard.model';
export declare class AdminDashboardService {
    private readonly bookingSaveRepository;
    private readonly depositRepository;
    private readonly newTicketRepository;
    constructor(bookingSaveRepository: Repository<BookingSave>, depositRepository: Repository<Deposit>, newTicketRepository: Repository<NewTicket>);
    findAll(initialDate: string, endDate: string): Promise<{
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
    vendorMakeTicket(ticketDataDTO: vendorTicket): Promise<BookingSave>;
    findAllTickets(): Promise<NewTicket[]>;
}
