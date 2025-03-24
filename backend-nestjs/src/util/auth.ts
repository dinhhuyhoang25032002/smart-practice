import { JwtService } from '@nestjs/jwt';

type token = {
    accessToken: string,
    refreshToken: string
};

const jwtService = new JwtService();

export const getToken = async (userId: string, role: string): Promise<token> => {
    const [accessToken, refreshToken] = await Promise.all([
        jwtService.signAsync(
            {
                sub: userId,
                role: role,
            },
            {
                secret: process.env.ACCESSTOKEN_SECRET_KEY,
                expiresIn: 60 * 60 * 24 * 7
            }
        ),
        jwtService.signAsync(
            {
                sub: userId,
                role: role,
            },
            {
                secret: process.env.REFRESHTOKEN_SECRET_KEY,
                expiresIn: 60 * 60 * 24 * 7
            }
        )
    ]);
    return {
        accessToken, refreshToken
    }
}