// backend/main/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// [수정 1] 경로 변경: ./vehicle.schema -> ../../schemas/vehicle.schema
import { Vehicle, VehicleSchema } from '../../schemas/vehicle.schema';
// Manufacturer는 아직 공통으로 안 뺐다면 그대로 유지, 뺐다면 경로 수정 필요
import { Manufacturer, ManufacturerSchema } from './manufacturer.schema';

import { RedisModule } from './redis/redis.module';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get('DATABASE_USER')}:${config.get('DATABASE_PASSWORD')}@${config.get('DATABASE_HOST')}:${config.get('DATABASE_PORT')}/${config.get('DATABASE_NAME')}?authSource=admin`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
    RedisModule,
  ],
  controllers: [AppController, VehicleController],
  providers: [AppService, VehicleService],
})
export class AppModule {}
