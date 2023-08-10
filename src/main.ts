import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';

import * as dotenv from 'dotenv';

async function bootstrap(): Promise<void> {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  const port = process.env.SERVER_PORT;
  if (process.env.NODE_ENV === 'dev') {
    const docsConfig = new DocumentBuilder()
      .setTitle('CRUD Boilerplate API')
      .setVersion('1.0')
      .addBearerAuth()
      .setDescription('All api endpoints')
      .build();

    const docs = SwaggerModule.createDocument(app, docsConfig);
    SwaggerModule.setup('/docs', app, docs);
  }

  await app.listen(port, () => {
    console.log('Server is started.');
  });
}

void bootstrap();
