import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from 'src/common/constants';
import { MailController } from './mail.controller';
import { MailProcessor } from './mail.prosessor';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const SMTP_HOST = configService.get('SMTP_HOST');
        const SMTP_PORT = configService.get('SMTP_PORT');
        const SMTP_USER = configService.get('SMTP_USER');
        const SMTP_PASS = configService.get('SMTP_PASS');
        const SMTP_FROM = configService.get('SMTP_FROM');

        const config = {
          transport: {
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASS,
            },
          },
          defaults: {
            from: SMTP_FROM,
          },
          template: {
            dir: join('templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };

        return config;
      },
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
