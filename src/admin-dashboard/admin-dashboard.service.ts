import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { Between, Like, Raw, Repository } from 'typeorm';
import { Deposit } from 'src/deposit/deposit.model';
import { NewTicket, vendorTicket } from './admin-dashboard.model';


@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(NewTicket)
    private readonly newTicketRepository:Repository<NewTicket>
  ) {}

  async findAll(initialDate: string, endDate: string) {
    //console.log(initialDate,endDate)
   // const dateRangePattern = (date: string) => `${date}%`;
    const startOfDay = new Date(initialDate).toISOString(); // 2024-11-21T00:00:00.000Z
    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999); // Include the full day
    const endOfDayISO = endOfDay.toISOString();
  
    // Fetch data for the given range
    const allDeposit = await this.depositRepository.find({
      where: {
        createdAt: Between(initialDate, endDate),
      },
    });
    const allBookings = await this.bookingSaveRepository.find({
      where: {
        bookingDate: Between(startOfDay, endOfDayISO),
      },
    });
    //console.log(allBookings)
  

    const pending = allDeposit.filter(
      (deposit) => deposit.status == 'Pending',
    ).length;
    const depositAmount = allDeposit.filter(
      (deposit) => deposit.status == 'Approved',
    );

    const totalAmount = depositAmount.reduce(
      (sum, deposit) => sum + deposit.ammount,
      0,
    );
  
    const requestTicket = allBookings.filter(
      (booking) => booking.bookingStatus === 'IssueInProcess',
    ).length;
    const booked = allBookings.filter(
      (booking) => booking.bookingStatus === 'Booked',
    ).length;
    const cancelled = allBookings.filter(
      (booking) => booking.bookingStatus === 'Cancelled',
    ).length;
    const ticketed = allBookings.filter(
      (booking) => booking.bookingStatus === 'Ticketed',
    ).length;
  
    // Flight calculations for specific dates
    const flight = await this.bookingSaveRepository.find();
  
    const todayFly = flight.filter((entry) =>
      entry.laginfo[0].DepDate.startsWith(initialDate),
    ).length;
  
    const tomorrowDate = new Date(initialDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateString = tomorrowDate.toISOString().split('T')[0];
    const tomorrowFly = flight.filter((entry) =>
      entry.laginfo[0].DepDate.startsWith(tomorrowDateString),
    ).length;
  
    const dayAfterTomorrowDate = new Date(initialDate);
    dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
    const dayAfterTomorrowString = dayAfterTomorrowDate.toISOString().split('T')[0];
    const dayAfterTomorrowFly = flight.filter((entry) =>
      entry.laginfo[0].DepDate.startsWith(dayAfterTomorrowString),
    ).length;
  
    return {
      Booking: {
        IssueInProcess: requestTicket,
        Booked: booked,
        Cancelled: cancelled,
        Ticketed: ticketed,
        TodayFly: todayFly,
        TomorrowFly: tomorrowFly,
        DayAfterTomorrowFly: dayAfterTomorrowFly,
      },
      Deposit: {
        pending: pending,
        TotalDeposit: totalAmount,
      },
    };
  }


//ticketDataDTO.vendorAmount in profit
    //ticketDataDTO.vendorName in profit
    //ticketDataDTO.segmentCount in profit
    //ticketDataDTO.profit in profit
  async vendorMakeTicket(ticketDataDTO:vendorTicket){
    const booking= await this.bookingSaveRepository.findOne({where:{bookingId:ticketDataDTO.bookingId}})
    if(!booking){
      throw new NotFoundException()
    }
    booking.PNR=ticketDataDTO.airlinesPNR
    booking.bookingData[0].System='FLYHUB'
    booking.bookingStatus='Ticketed'
    booking.bookingData[0].GDSPNR=booking.bookingData[0].PNR
    booking.bookingData[0].PNR=ticketDataDTO.airlinesPNR 
    const mappedPassengerList = booking.bookingData[0].PassengerList.map((passenger, index) => {
      
      return {
        ...passenger,
        Ticket: ticketDataDTO.ticketNumber[index] 
          ? [{ TicketNo: ticketDataDTO.ticketNumber[index].eticket.toString() }] 
          : [{ TicketNo: null }]  
      };
    });
    booking.bookingData[0].PassengerList = mappedPassengerList;

    
    console.log(await this.bookingSaveRepository.save(booking))
    return booking
  }


  async findAllTickets(): Promise<NewTicket[]> {
    return await this.newTicketRepository.find();
  }
}
