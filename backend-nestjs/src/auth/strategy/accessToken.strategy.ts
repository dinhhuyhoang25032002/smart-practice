import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Global, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type JwtPayload = {
    sub: string,
    email: string
}

@Global()
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy,'jwt-access') {
    constructor(
        protected readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('ACCESSTOKEN_SECRET_KEY'),
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
