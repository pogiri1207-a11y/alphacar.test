import { Module, Global, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// [기존 유지] 제조사 스키마는 로컬 유지 (혹은 공통으로 옮겼다면 경로 수정 필요)
import { Manufacturer, ManufacturerSchema } from './schemas/manufacturer.schema';

// [수정] 차량 관련 스키마는 이제 '공통 스키마' 하나만 가져옵니다.
// 트림, 옵션 등은 이 안에 모두 포함되어 있습니다.
import { Vehicle, VehicleSchema } from '../../schemas/vehicle.schema';

import { EstimateModule } from './estimate/estimate.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        // 1. 차량 데이터 DB 연결 (기본 연결) - [기존 유지]
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                uri: `mongodb://${config.get('DATABASE_USER')}:${config.get('DATABASE_PASSWORD')}@${config.get('DATABASE_HOST')}:${config.get('DATABASE_PORT')}/${config.get('DATABASE_NAME')}?authSource=admin`,
            }),
            inject: [ConfigService],
        }),

        // 2. 견적서 저장용 원격 DB 연결 (이름: estimate_conn) - [기존 유지]
        MongooseModule.forRoot(
            'mongodb://naver_car_data_user:naver_car_data_password@192.168.0.201:27017/estimate_db?authSource=admin',
            { connectionName: 'estimate_conn' }
        ),

        // 3. 컬렉션 등록 (기본 DB용)
        MongooseModule.forFeature([
            { name: Manufacturer.name, schema: ManufacturerSchema }, // [기존 유지]
            { name: Vehicle.name, schema: VehicleSchema },           // [수정] 공통 스키마 사용
            
            // [삭제] VehicleTrim, VehicleOption은 이제 Vehicle 안에 포함되므로 
            // 별도 모델로 등록하지 않습니다. (새 스키마 구조 반영)
        ]),

        // 4. 모듈 등록 - [기존 유지]
        EstimateModule,
        VehiclesModule,
        forwardRef(() => VehiclesModule),
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [AppService],
})
export class AppModule {}
