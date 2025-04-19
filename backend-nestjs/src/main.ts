import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigCors } from 'src/config/configCors';
import { ValidationPipe } from '@nestjs/common';
// import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';
import { staticFolders } from './constant/constant';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    cors: ConfigCors,
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: false }));
  // app.use(
  //   session({
  //     secret: configService.get('SESSION_SECRET_KEY'),
  //     resave: false,
  //     saveUninitialized: false,

  //     cookie: {
  //       maxAge: 60 * 60 * 24 * 7,
  //       httpOnly: true
  //     },
  //   }));
  app.use(passport.initialize());
  //app.use(passport.session());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(cookieParser());

  staticFolders.forEach((folder) => {
    app.useStaticAssets(join(__dirname, '..', folder.path), {
      prefix: folder.prefix + '/', // Ví dụ: http://localhost:3001/uploads/image.png
      setHeaders: (res: Response) => {
        res.setHeader(
          'Access-Control-Allow-Origin',
          `${configService.get<string>('NEXT_PUBLIC_API_URL')}`,
        );
      },
    });
  });

  const config = new DocumentBuilder()
    .setTitle('Smart-Practice')
    .setDescription('The API List for Smart-Practice')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const PORT = configService.get('PORT');
  await app.listen(PORT, () => {
    console.log(`Application is running on port: ${PORT}`);
  });
}
bootstrap();
