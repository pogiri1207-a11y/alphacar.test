// backend/quote/src/app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Manufacturer } from './schemas/manufacturer.schema';
import { Vehicle } from './schemas/vehicle.schema';
import { VehicleTrim } from './schemas/vehicle_trim.schema';
import { VehicleOption } from './schemas/vehicle_option.schema'; // [import 확인]

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Manufacturer.name) private manufacturerModel: Model<Manufacturer>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(VehicleTrim.name) private trimModel: Model<VehicleTrim>,
    // [추가] 옵션을 직접 검색하기 위해 모델 주입
    @InjectModel(VehicleOption.name) private optionModel: Model<VehicleOption>,
  ) {}

  // 1. 제조사 목록
  async getManufacturers() {
    return this.manufacturerModel.find({}, { name: 1, _id: 1 }).exec();
  }

  // 2. 모델 목록
  async getModelsByManufacturer(makerId: string) {
    return this.vehicleModel
      .find({ manufacturer_id: new Types.ObjectId(makerId) }, { model_name: 1, _id: 1 })
      .exec();
  }

  // 3. 트림 목록
  async getTrimsByModel(vehicleId: string) {
    return this.trimModel
      .find({ vehicle_id: new Types.ObjectId(vehicleId) }, { name: 1, base_price: 1, _id: 1 })
      .exec();
  }

  // 4. 트림 상세 정보 (수정됨: 배열이 비었으면 직접 검색)
  async getTrimDetail(trimId: string) {
    console.log(`[Debug] 요청받은 ID: ${trimId}`);

    try {
      // 1. 일단 트림 정보를 가져옵니다 (Populate 시도)
      let trimData = await this.trimModel
        .findById(trimId)
        .populate('options') 
        .exec();

      if (!trimData) return null;

      // 2. 만약 options 배열이 비어있다면? -> 옵션 컬렉션에서 직접 검색!
      if (!trimData.options || trimData.options.length === 0) {
        console.log(`[Debug] options 배열이 비어있음 -> vehicleoptions 컬렉션 직접 검색 시도`);
        
        // "trim_id가 이거인 옵션들 다 가져와"
        const foundOptions = await this.optionModel.find({ 
          trim_id: new Types.ObjectId(trimId) 
        }).exec();

        console.log(`[Debug] 직접 찾은 옵션 개수: ${foundOptions.length}`);
        
        // 찾은 옵션을 강제로 넣어줍니다.
        // (Mongoose 문서는 불변일 수 있어서 .toObject()로 변환 후 할당)
        const trimObj = trimData.toObject(); 
        trimObj.options = foundOptions;
        return trimObj;
      }

      return trimData;
    } catch (e) {
      console.error(`[Debug] DB 에러 발생:`, e);
      return null;
    }
  }
}
