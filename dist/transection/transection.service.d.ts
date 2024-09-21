import { AuthService } from "src/auth/auth.service";
import { BookingSave } from "src/book/booking.model";
import { Repository } from "typeorm";
export declare class TransectionService {
    private readonly authService;
    private readonly bookingRepository;
    constructor(authService: AuthService, bookingRepository: Repository<BookingSave>);
    paymentWithWallet(header: any, bookingId: string): Promise<void>;
}
