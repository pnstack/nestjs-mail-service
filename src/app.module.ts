import { AuthService } from '@modules/auth/auth.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import config from 'src/common/configs/config';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';
import { PrismaModule } from 'src/common/prisma/prisma';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/user/users.module';
import { GqlConfigService } from './common/graphql/gql-config.service';
import { QueryModule } from './modules/query/query.module';
import { customPrismaMiddleware } from './utils/prisma.util';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware')), customPrismaMiddleware()], // configure your prisma middleware
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [AuthModule],
      useClass: GqlConfigService,
      driver: ApolloDriver,
      inject: [ConfigService, AuthService],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UsersModule,
    QueryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}