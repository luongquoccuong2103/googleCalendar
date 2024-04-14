import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretjwt4565',
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
