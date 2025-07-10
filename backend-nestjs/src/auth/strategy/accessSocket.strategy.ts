// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './accessToken.strategy';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-socket',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // request ở đây là client socket handshake
          return (
            request.handshake?.auth?.token ||
            request.handshake?.headers?.authorization?.replace('Bearer ', '')
          );
        },
      ]),
      secretOrKey: process.env.ACCESSTOKEN_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload) {
    // payload là dữ liệu decode từ token, bạn có thể trả về user info
    return payload;
  }
}
