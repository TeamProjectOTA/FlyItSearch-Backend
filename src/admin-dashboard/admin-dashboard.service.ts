import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { Like, Raw, Repository } from 'typeorm';
import { Deposit } from 'src/deposit/deposit.model';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository:Repository<BookingSave>,
    @InjectRepository(Deposit)
    private readonly depositRepository:Repository<Deposit>,
  
  ){}
  
  async findAll(depositDate:string){
     const datePattern = `${depositDate}%`
    const allDeposit= await this.depositRepository.find({
      where:{
        createdAt:Like(datePattern)
      }
    })
    const allBookings = await this.bookingSaveRepository.find({
      where: {
        bookingDate: Like(datePattern),
      },
    });
    const pending= (allDeposit.filter(deposit=>deposit.status=='Pending')).length
    const depositAmmount=allDeposit.filter(deposit=>deposit.status=='Approved')
    const totalAmount = depositAmmount.reduce((sum, deposit) => sum + deposit.ammount, 0);
    const requestTicket = allBookings.filter(booking => booking.bookingStatus === 'IssueInProcess').length;
    const booked = allBookings.filter(booking => booking.bookingStatus === 'Booked').length;
    const cancelled = allBookings.filter(booking => booking.bookingStatus === 'Cancelled').length;
    const ticketed = allBookings.filter(booking => booking.bookingStatus === 'Ticketed').length;

    const flight = await this.bookingSaveRepository.find({
      where: {
        laginfo: Raw(alias => `JSON_EXTRACT(${alias}, '$[0].DepDate') LIKE :datePattern`, { datePattern: `${depositDate}%` })
      }
    });
    
    
    return {
      Booking:{IssueInProcess: requestTicket,
      Booked: booked,
      Cancelled: cancelled,
      Ticketed: ticketed,
      Flydetails:flight,
    },
      Deposit:{pending:pending,
        TotalDeposit:totalAmount},
    };
  }


}
