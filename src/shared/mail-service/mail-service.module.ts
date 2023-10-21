import { MailServiceController } from './mail-service.controller';
import { MailServiceService } from './mail-service.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [MailServiceController],
  providers: [
    {
      provide: 'MAIL_SERVICE',
      useFactory: (configService: ConfigService) => {
        const MQ_QUEUE_NAME = configService.get('MQ_QUEUE_NAME', 'mail_queue');
        const serverRMQ = configService.get('AMQP_URL');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [serverRMQ],
            queue: MQ_QUEUE_NAME,
            // noAck: false,
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    MailServiceService,
  ],
})
export class MailServiceModule {}
