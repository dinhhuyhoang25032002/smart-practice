import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Global, Injectable } from '@nestjs/common';

export type JwtPayload = {
  sub: string;
  role: string;
};

@Global()
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESSTOKEN_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
