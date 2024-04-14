import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { UserService } from 'src/user/user.service';
import { RefreshJwtGuard } from './guard/refresh-jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() response: Response) {
    return await this.authService.login(req.user, response);
  }

  @Post('/register')
  async registerUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    return await this.userService.create(createUserDto, response);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}
