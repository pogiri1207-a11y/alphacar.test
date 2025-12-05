// src/estimate/estimate.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Estimate, EstimateDocument } from './schemas/estimate.schema';

@Injectable()
export class EstimateService {
  constructor(
    @InjectModel(Estimate.name, 'estimate_conn') // ⭐ estimate_conn 연결 사용
    private estimateModel: Model<EstimateDocument>,
  ) {}

  // 1. 견적 저장
  async create(createEstimateDto: any) {
    const createdEstimate = new this.estimateModel(createEstimateDto);
    return createdEstimate.save();
  }

  // 2. 내 견적 목록 조회
  async findAll(userId: string) {
    return this.estimateModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // 3. 내 견적 개수 조회 (마이페이지용)
  async count(userId: string) {
    return this.estimateModel.countDocuments({ userId }).exec();
  }

  // ✅ [신규 추가] 견적 삭제 메서드
  async delete(id: string) {
    return this.estimateModel.findByIdAndDelete(id).exec();
  }
}
