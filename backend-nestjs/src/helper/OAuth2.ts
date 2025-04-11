import { OAuth2Client } from "google-auth-library";
import { ConfigService } from '@nestjs/config';
import { MailerOptions, TransportType } from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";
export const createMailerOptions = async (configService: ConfigService): Promise<MailerOptions> => {
    const clientId = configService.get<string>('CLIENT_AUTH_GOOGLE_ID');
    const clientSecret = configService.get<string>('CLIENT_AUTH_GOOGLE_SECRET');
    const refreshToken = configService.get<string>('REFRESH_TOKEN');
    const oauth2Client = new OAuth2Client({
        clientId: configService.get<string>("CLIENT_AUTH_GOOGLE_ID"),
        clientSecret: configService.get<string>("CLIENT_AUTH_GOOGLE_SECRET"),
        redirectUri: configService.get<string>("REDIRECT_URL")
    })
    oauth2Client.setCredentials({
        refresh_token: configService.get<string>("REFRESH_TOKEN")
    })

    const { token } = await oauth2Client.getAccessToken();
    const transport: TransportType = {
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.SENDER_EMAIL,
            clientId: process.env.CLIENT_AUTH_GOOGLE_ID,
            clientSecret: process.env.CLIENT_AUTH_GOOGLE_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: token
        }
    }
    return { transport };
}