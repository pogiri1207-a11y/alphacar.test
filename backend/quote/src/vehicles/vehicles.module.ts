import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesController } from './vehicles.controller';

// [수정] 공통 스키마 경로 (상위로 3번 올라가야 합니다)
import { Vehicle, VehicleSchema } from '../../../schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      // [수정] Vehicle 스키마 하나만 등록 (Trim, Option 제거)
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
