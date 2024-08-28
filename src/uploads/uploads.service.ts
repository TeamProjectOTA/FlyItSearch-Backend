import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

import { extname, join } from 'path';
import { promises as fs } from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(ProfilePicture)
    private profilePictureRepository: Repository<ProfilePicture>,
    private readonly authservice: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
 @UseGuards(UserTokenGuard)
  async create(
    header: any,
    file: Express.Multer.File,
  ): Promise<ProfilePicture> {
    const decodeToken = await this.authservice.decodeToken(header);
    const user = await this.userRepository.findOne({
      where: { email: decodeToken },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }
    const existingProfilePicture = await this.profilePictureRepository.findOne({
      where: { user },
    });

    if (existingProfilePicture) {
      try {
        await fs.unlink(existingProfilePicture.path);
      } catch (error) {
      }
      await this.profilePictureRepository.remove(existingProfilePicture);
    }
    const fileExtension = extname(file.originalname);
    const filename = `${user.passengerId}-ProfilePicture_of-${user.fullName}${fileExtension}`;
    const path = join('uploads', filename);
    try {
      await fs.rename(file.path, path);
    } catch (error) {
      throw new BadRequestException('Failed to save file.');
    }
    const size = file.size;
    const profilePicture = this.profilePictureRepository.create({
      user,
      filename,
      path,
      size,
    });
    return this.profilePictureRepository.save(profilePicture);
  }
  async delete(header: any): Promise<any> {
    const decodeToken = await this.authservice.decodeToken(header);
    const user = await this.userRepository.findOne({
      where: { email: decodeToken },
    });
    const profilePicture = await this.profilePictureRepository.findOne({
      where: { user },
    });

    if (!profilePicture) {
      throw new NotFoundException('Profile picture not found');
    }

    return await this.profilePictureRepository.remove(profilePicture);
  }
}
