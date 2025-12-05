// backend/quote/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Manufacturer, ManufacturerSchema } from './schemas/manufacturer.schema';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { VehicleTrim, VehicleTrimSchema } from './schemas/vehicle_trim.schema';
import { VehicleOption, VehicleOptionSchema } from './schemas/vehicle_option.schema';
import { EstimateModule } from './estimate/estimate.module'; // 모듈 임포트

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 1. [기존 유지] 차량 데이터 DB 연결 (기본 연결)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get('DATABASE_USER')}:${config.get('DATABASE_PASSWORD')}@${config.get('DATABASE_HOST')}:${config.get('DATABASE_PORT')}/${config.get('DATABASE_NAME')}?authSource=admin`,
      }),
      inject: [ConfigService],
    }),

    // 2. ⭐ [신규 추가] 견적서 저장용 원격 DB 연결 (이름: estimate_conn)
    // 192.168.0.201 서버의 estimate_db에 연결합니다.
    MongooseModule.forRoot(
      'mongodb://naver_car_data_user:naver_car_data_password@192.168.0.201:27017/estimate_db?authSource=admin',
      { connectionName: 'estimate_conn' }
    ),

    // 3. [기존 유지] 컬렉션 등록 (기본 DB용)
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: VehicleTrim.name, schema: VehicleTrimSchema },
      { name: VehicleOption.name, schema: VehicleOptionSchema },
    ]),

    // 4. ⭐ [신규 추가] EstimateModule 등록
    EstimateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
