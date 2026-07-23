import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted:true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api', {
    exclude: [],
  });

  const config = new DocumentBuilder()
    .setTitle('Internship Applicant Management API')
    .setDescription('API documentation for Internship applications Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

     const document = SwaggerModule.createDocument(app, config);

     SwaggerModule.setup('docs', app, document);
     
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') ?? 3000;

  await app.listen(port);

  console.log(`running on http://localhost:${port}`);
}

bootstrap();
