import { MailModule } from './modules/mail/mail.module';
import { MailServiceModule } from './shared/mail-service/mail-service.module';
import config from '@/common/configs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ScheduleModule.forRoot(),
    AuthModule,
    MailModule,
    MailServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
