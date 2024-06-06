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
    path: string,
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
    newPackage.picture = path;
    const savedPackage = await this.tourPacageRepository.save(newPackage);

    if (!savedPackage) {
      throw new InternalServerErrorException('Failed to save tour package');
    }
    return savedPackage;
  }
  async findOne(title: string) {
    let packagefind = await this.tourPacageRepository.findOne({
      where: { title: title },
    });
    if (!packagefind) {
      throw new NotFoundException();
    }
    return packagefind;
  }


 


  async findAll(category:string) {
    return await this.tourPacageRepository.find({where:{category}});
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
