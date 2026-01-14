import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}
    async findByEmail(email: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    async create(createUserDto: CreateUserDto): Promise<User | false> {
        const user = await this.userModel.findOne({ email }).exec();
        if (user) {
            throw new BadRequestException('User already exists');
        }
        const createdUser = new this.userModel(createUserDto);
        createdUser.password = await bcrypt.hash(createUserDto.password, 10);
        return await createdUser.save();
    }
    async saveRefreshToken(userId: string, refreshToken: string) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
    }
}
