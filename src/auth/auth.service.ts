import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findOneWithUserName(userName);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        ...user,
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '7d',
        }),
      },
    });
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
