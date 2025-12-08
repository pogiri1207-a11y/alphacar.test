// backend/main/src/app.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// [수정 1] 경로 변경: 공통 스키마 가져오기
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { Manufacturer, ManufacturerDocument } from './manufacturer.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Manufacturer.name) private manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findAllMakers() {
    return this.manufacturerModel.find().exec();
  }

  // [수정 2] 새 스키마(danawa_vehicle_data)에 맞춰 로직 전면 수정
  async getCarList() {
    const vehicles = await this.vehicleModel.aggregate([
      // 1. 새 스키마는 brand_name을 직접 가지고 있으므로 $lookup(조인)이 필요 없을 수 있습니다.
      //    하지만 프론트엔드 포맷(name, manufacturer, minPrice)에 맞춰 데이터를 가공합니다.
      {
        $project: {
          _id: 1,
          name: '$vehicle_name',        // 변경: model_name -> vehicle_name
          manufacturer: '$brand_name',  // 변경: 조인 대신 직접 필드 사용
          imageUrl: '$main_image',      // 변경: image_url -> main_image
          // 변경: base_price가 없으므로 trims 배열에서 가장 낮은 가격 추출
          minPrice: { 
            $min: '$trims.price' 
          },
        },
      },
      // 가격 정보가 없는 차량 제외 (선택사항)
      // { $match: { minPrice: { $ne: null } } } 
    ]).exec();

    return vehicles;
  }

  async getModelsByMaker(makerId: string) {
    // [수정 3] 새 스키마는 manufacturer_id 대신 brand_name(문자열)을 사용할 가능성이 큽니다.
    // 만약 makerId가 "Hyundai" 같은 문자열로 넘어온다면 아래처럼 수정:
    return this.vehicleModel.find({ brand_name: makerId }).exec();
    
    // *주의*: 만약 기존처럼 ObjectId로 검색해야 한다면 새 데이터에도 manufacturer_id 필드가 있어야 합니다.
    // 현재 명세서에는 brand_name만 있으므로 문자열 검색으로 바꿨습니다.
  }

  async getTrims(vehicleId: string) {
    // 1. 차량 ID로 조회
    const vehicle = await this.vehicleModel.findById(vehicleId).exec();
    if (!vehicle) return [];

    // [수정 4] 새 스키마는 trims가 배열로 내장되어 있습니다. 
    // 별도로 다시 find 할 필요 없이 바로 반환하면 됩니다.
    return vehicle.trims || [];
  }
}
