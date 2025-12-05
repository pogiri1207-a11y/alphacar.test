// src/estimate/estimate.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';
import { Estimate, EstimateSchema } from './schemas/estimate.schema';

@Module({
  imports: [
    // ⭐ estimate_conn 연결에 스키마 등록
    MongooseModule.forFeature(
      [{ name: Estimate.name, schema: EstimateSchema }],
      'estimate_conn' 
    ),
  ],
  controllers: [EstimateController],
  providers: [EstimateService],
})
export class EstimateModule {}
