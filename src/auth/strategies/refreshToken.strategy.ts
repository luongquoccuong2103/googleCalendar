import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: false,
      secretOrKey: 'secretjwt4565',
    });
  }

  async validate(payload: any) {
    return { user: payload.sub, username: payload.username };
  }
}
