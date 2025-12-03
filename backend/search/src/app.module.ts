import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Vehicle, VehicleSchema } from './vehicle.schema';
import { Manufacturer, ManufacturerSchema } from './manufacturer.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // triple_db 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get('DATABASE_USER')}:${config.get('DATABASE_PASSWORD')}@${config.get('DATABASE_HOST')}:${config.get('DATABASE_PORT')}/triple_db?authSource=admin`,
      }),
      inject: [ConfigService],
    }),
    // Vehicle, Manufacturer 모델 등록
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
