import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigCors } from 'src/config/configCors';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
// import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import type { Response } from 'express';
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
  app.useBodyParser('json', { limit: '1gb' });
  app.useBodyParser('text', { limit: '1gb' });
  app.useBodyParser('urlencoded', { limit: '1gb', extended: true });
  app.use(cookieParser());

  // Cấu hình cho upload file lớn
  app.use((req, res, next) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=300');
    next();
  });

  // Tăng timeout cho request
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    maxAge: 3600,
  });

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
    .setTitle('Smart Practice API')
    .setDescription('The Smart Practice API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = configService.get('PORT');
  await app.listen(PORT, () => {
    console.log(`Application is running on port: ${PORT}`);
  });
}
bootstrap();
