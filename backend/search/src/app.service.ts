// backend/search/src/app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './car.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  // 1. 전체 조회
  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  // 2. 검색 (필드명 vehicle_name으로 변경)
  async search(keyword: string): Promise<Car[]> {
    return this.carModel.find({
      vehicle_name: { $regex: keyword, $options: 'i' }, 
    }).exec();
  }
}
