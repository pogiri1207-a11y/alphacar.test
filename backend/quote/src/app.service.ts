import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Manufacturer } from './schemas/manufacturer.schema';
import { Vehicle } from './schemas/vehicle.schema';
import { VehicleTrim } from './schemas/vehicle_trim.schema';
import { VehicleOption } from './schemas/vehicle_option.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Manufacturer.name) private manufacturerModel: Model<Manufacturer>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(VehicleTrim.name) private trimModel: Model<VehicleTrim>,
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

  // 4. 트림 상세 정보
  async getTrimDetail(trimId: string) {
    console.log(`[Debug] 요청받은 ID: ${trimId}`);

    try {
      let trimData = await this.trimModel
        .findById(trimId)
        .populate('options')
        .exec();

      if (!trimData) return null;

      // 옵션 데이터가 없을 경우 직접 조회하는 로직 유지
      if (!trimData.options || trimData.options.length === 0) {
        console.log(`[Debug] options 배열이 비어있음 -> vehicleoptions 컬렉션 직접 검색 시도`);
        
        const foundOptions = await this.optionModel.find({ 
          trim_id: new Types.ObjectId(trimId) 
        }).exec();

        console.log(`[Debug] 직접 찾은 옵션 개수: ${foundOptions.length}`);
        
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

  // 5. [필수 추가] 비교 데이터 조회 메서드
  // 콤마(,)로 구분된 ID 문자열을 받아 각각 상세 정보를 조회하여 배열로 반환합니다.
  async getCompareData(ids: string) {
    if (!ids) return [];
    
    // ID 분리
    const idList = ids.split(',').filter(id => id && id.trim() !== '');
    
    // 각 ID에 대해 getTrimDetail 재사용
    const promises = idList.map(id => this.getTrimDetail(id));
    
    // 병렬 처리 후 결과 반환
    const results = await Promise.all(promises);
    return results.filter(item => item !== null);
  }
}
