import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourpackage, TourpackageDto } from './tourpackage.model';
import { Repository } from 'typeorm';

@Injectable()
export class TourpackageService {
  constructor(
    @InjectRepository(Tourpackage)
    private readonly tourPacageRepository: Repository<Tourpackage>,
  ) {}
  async create(
    tourPackageDto: TourpackageDto,
    paths: string[],
    fileDetails: { path: string; size: number }[],
  ): Promise<Tourpackage> {
    const packageTitle = await this.tourPacageRepository.findOne({
      where: { title: tourPackageDto.title },
    });
    if (packageTitle) {
      throw new ConflictException('Title already existed');
    }
    const newPackage = new Tourpackage();
    newPackage.title = tourPackageDto.title;
    newPackage.category = tourPackageDto.category;
    newPackage.date = tourPackageDto.date;
    newPackage.description = tourPackageDto.description;
    newPackage.pictureName = JSON.stringify(paths);
    newPackage.path = fileDetails[0].path;
    newPackage.size = fileDetails[0].size;
    const savedPackage = await this.tourPacageRepository.save(newPackage);

    if (!savedPackage) {
      throw new InternalServerErrorException('Failed to save tour package');
    }
    return savedPackage;
  }

  async findOne(category: string) {
    let packagefind = await this.tourPacageRepository.find({
      where: { category },
    });
    if (!packagefind) {
      throw new NotFoundException(`No ${category} avilable at the moment`);
    }
    if (category == 'all') {
      return await this.tourPacageRepository.find();
    } else {
      return packagefind;
    }
  }

  // async findAll():Promise<Tourpackage[]> {
  //   const allDeals =await this.tourPacageRepository.find();
  //   return allDeals
  // }

  async Delete(title: string) {
    const findDeals = await this.tourPacageRepository.findOne({
      where: { title: title },
    });
    const deleteDeals = await this.tourPacageRepository.delete({
      title: title,
    });
    return { findDeals, deleteDeals };
  }

  //   async findByHotel(category:string){
  //     const hotel =await this.tourPacageRepository.find({where:{category}})
  //     if(!hotel||hotel.length==0){
  //       throw new NotFoundException("No Hotel deals avilable at the moment")
  //     }
  //     return hotel
  //   }

  //   async findByGroupFare(category: string) {
  //     const groupFare = await this.tourPacageRepository.find({ where: { category } });
  //     if (!groupFare || groupFare.length === 0) {
  //         throw new NotFoundException("No Group Fare available at the moment");
  //     }
  //     return groupFare;
  // }

  // async findByTour(category:string){
  //   const tour= await this.tourPacageRepository.find({where:{category}})
  //   if(!tour || tour.length==0){
  //     throw new NotFoundException("No Tour deals avilable at the moment")
  //   }
  // }
  // async findByFlight(category: string) {
  //   const flight = await this.tourPacageRepository.find({
  //     where: { category },
  //   })
  //   if(!flight||flight.length==0){
  //     throw new NotFoundException("No flight deals avilable at the moment")
  //   }
  //   return flight;
  // }
}
