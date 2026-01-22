import { Controller, UseGuards, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() loginDto: { email: string, password: string }) {
    // todo: create dto for login
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: CreateUserDto): Promise<boolean> {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  profile(@Req() req: any) {
    return req.user;
  }

  @Public()
  @Post('refresh')
  refresh(@Body() refreshDto: { refreshToken: string }) {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }
}
