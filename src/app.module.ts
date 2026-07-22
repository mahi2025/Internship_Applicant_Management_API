import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { validationSchema } from './config/validation.schema';
import { HealthController } from './health/health.controller';


@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal:true,
      load:[config],
      validationSchema,
    }),
  ],
  controllers: [HealthController],
})

export class AppModule {}
