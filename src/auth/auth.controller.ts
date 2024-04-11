import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { UserService } from 'src/user/user.service';
import { RefreshJwtGuard } from './guard/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('/register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}
