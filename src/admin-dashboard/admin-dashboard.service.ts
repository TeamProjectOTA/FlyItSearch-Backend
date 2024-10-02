import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { Like, Raw, Repository } from 'typeorm';
import { Deposit } from 'src/deposit/deposit.model';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
  ) {}

  async findAll(depositDate: string) {
    const datePattern = `${depositDate}%`;
    const allDeposit = await this.depositRepository.find({
      where: {
        createdAt: Like(datePattern),
      },
    });
    const allBookings = await this.bookingSaveRepository.find({
      where: {
        bookingDate: Like(datePattern),
      },
    });
    const pending = allDeposit.filter(
      (deposit) => deposit.status == 'Pending',
    ).length;
    const depositAmmount = allDeposit.filter(
      (deposit) => deposit.status == 'Approved',
    );
    const totalAmount = depositAmmount.reduce(
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

    const flight = await this.bookingSaveRepository.find();
    const todayFly = flight.filter((date1) =>
      date1.laginfo[0].DepDate.startsWith(depositDate),
    ).length;
    let nextDay = new Date(depositDate);
    nextDay.setDate(nextDay.getDate() + 1);
    let nextDateString = nextDay.toISOString().split('T')[0];
    const tomorrowFly = flight.filter((date1) =>
      date1.laginfo[0].DepDate.startsWith(nextDateString),
    ).length;

    nextDay.setDate(nextDay.getDate() + 1);
    let nextNextDayString = nextDay.toISOString().split('T')[0];
    const dayAfterTomorrowFly = flight.filter((date1) =>
      date1.laginfo[0].DepDate.startsWith(nextNextDayString),
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
}
