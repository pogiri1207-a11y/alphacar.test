import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './vehicle.schema';
import { Manufacturer, ManufacturerDocument } from './manufacturer.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Manufacturer.name) private manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  async searchCars(keyword: string) {
    if (!keyword) return [];

    const regex = new RegExp(keyword, 'i'); // 대소문자 무시 검색

    const cars = await this.vehicleModel.aggregate([
      // 1. manufacturers 컬렉션과 조인
      {
        $lookup: {
          from: 'manufacturers',            // 조인할 컬렉션 이름
          localField: 'manufacturer_id',    // Vehicle의 필드
          foreignField: '_id',              // Manufacturer의 필드
          as: 'manufacturer_info',
        },
      },
      // 2. 배열을 객체로 풀기
      { $unwind: '$manufacturer_info' },

      // 3. 검색 조건: 차량명 또는 제조사 이름에 키워드가 포함된 경우
      {
        $match: {
          $or: [
            { model_name: { $regex: regex } },             // 차량명 검색
            { 'manufacturer_info.name': { $regex: regex } } // 제조사명 검색
          ],
        },
      },

      // 4. 가져올 데이터 정리 (프론트엔드 포맷에 맞춤)
      {
        $project: {
          _id: 1,
          // 이름 포맷: "[제조사] 차량명"
          name: { $concat: ['[', '$manufacturer_info.name', '] ', '$model_name'] },
          image: '$image_url',
          price: '$base_price',
        },
      },
    ]).exec();

    // 5. 최종 반환 데이터 포맷팅
    return cars.map(car => ({
      id: car._id,
      name: car.name,
      image: car.image || '',
      priceRange: car.price ? `${(car.price / 10000).toLocaleString()}만원` : '가격 정보 없음',
      trims: [] // vehicles 컬렉션에는 트림 정보가 없으므로 빈 배열 처리
    }));
  }
}
