import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(registerDto: CreateUserDto): Promise<boolean> {
        const user = await this.usersService.create(registerDto);
        if (!user) {
            throw new BadRequestException('Failed to create user');
        }
        return true;
    }

    async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        await this.usersService.saveRefreshToken(user._id.toString(), refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = await this.jwtService.verifyAsync(refreshToken);

        if (payload.type !== 'refresh') {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const accessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user);

        await this.usersService.saveRefreshToken(user._id.toString(), newRefreshToken);

        return {
            accessToken,
            refreshToken: newRefreshToken,
        }
    }

    generateAccessToken(user: UserDocument): string {
        return this.jwtService.sign({ sub: user._id, email: user.email, username: user.username });
    }

    generateRefreshToken(user: User): string {
        return this.jwtService.sign(
            { type: 'refresh', email: user.email },
            { expiresIn: this.configService.get('jwt.refreshTokenExpiresIn') }
        );
    }
}
