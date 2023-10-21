import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const setupMicroservice = async (app: INestApplication) => {
  // Load config
  const configService = app.get(ConfigService);
  const MQ_QUEUE_NAME = configService.get('MQ_QUEUE_NAME', 'mail_queue');
  const MQ_PREFETCH_COUNT = configService.get<string>('MQ_PREFETCH_COUNT');
  const MQ_ACK = configService.get('MQ_ACK') || true;

  const serverRMQ = configService.get('AMQP_URL');

  // Start microservice for mail
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [serverRMQ],
      queue: MQ_QUEUE_NAME,
      noAck: false,
      queueOptions: {
        durable: false,
      },
      ...(MQ_PREFETCH_COUNT && { prefetchCount: parseInt(MQ_PREFETCH_COUNT) }),
    },
  });

  await app.startAllMicroservices().then(() => console.log('Microservice is listening'));
};
