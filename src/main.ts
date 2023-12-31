import { setupMicroservice } from './common/microservices';
import { AppModule } from '@/app.module';
import type { NestConfig } from '@/common/configs/config.interface';
import { setupSwagger } from '@/common/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));

  // Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters();

  const AMQP_URL = configService.get('AMQP_URL');

  await setupSwagger(app);
  if (AMQP_URL) {
    await setupMicroservice(app);
  }

  // Listen port
  const nestConfig = configService.get<NestConfig>('nest');
  const port = process.env.PORT || nestConfig.port || 3000;
  await app
    .listen(port)
    .then(() => {
      console.log(`http://localhost:${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
}

bootstrap();
