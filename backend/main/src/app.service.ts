// alphacar-project/alphacar/alphacar-0f6f51352a76b0977fcac48535606711be26d728/backend/main/src/app.service.ts
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

  getHello(): string {
    return 'Hello World!';
  }

  async getCarList() {
    // Aggregation Pipeline을 사용하여 Vehicle과 Manufacturer를 조인합니다.
    const vehiclesWithManufacturer = await this.vehicleModel.aggregate([
      // 1. manufacturers 컬렉션과 조인 ($lookup)
      {
        $lookup: {
          from: 'manufacturers',            // 조인할 컬렉션 이름
          localField: 'manufacturer_id',    // 👈 [수정] DB 필드명 manufacturer_id 사용
          foreignField: '_id',              // manufacturers 컬렉션의 _id 참조
          as: 'manufacturer_info',          // 결과를 저장할 새로운 필드 이름
        },
      },
      // 2. manufacturer_info 배열을 객체로 변환 ($unwind)
      {
        $unwind: '$manufacturer_info',
      },
      // 3. 필요한 필드만 선택 및 이름 변경 ($project)
      {
        $project: {
          _id: 0,
          name: '$model_name',                       // model_name -> name
          manufacturer: '$manufacturer_info.name',   // manufacturer_info.name -> manufacturer
          imageUrl: '$image_url',                    // image_url -> imageUrl
          minPrice: '$base_price',                   // 👈 [수정] base_price -> minPrice
        },
      },
    ]).exec();
    
    return vehiclesWithManufacturer;
  }
}
