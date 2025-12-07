import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { Manufacturer, ManufacturerDocument } from './schemas/manufacturer.schema';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        @InjectModel(Manufacturer.name) private manufacturerModel: Model<ManufacturerDocument>,
        @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    ) {}

    // 1. 제조사 목록
    async getManufacturers() {
        return this.manufacturerModel.find({}, { name: 1, _id: 1 }).lean().exec();
    }

    // 2. 모델 목록
    async getModelsByManufacturer(makerId: string) {
        if (!makerId) return [];
        let maker;
        try {
            if (Types.ObjectId.isValid(makerId)) {
                maker = await this.manufacturerModel.findById(makerId).lean().exec();
            }
            if (!maker) {
                maker = await this.manufacturerModel.findOne({ _id: makerId } as any).lean().exec();
            }
        } catch (e) { return []; }

        if (!maker) return [];

        return this.vehicleModel
            .find({ brand_name: maker.name }, { vehicle_name: 1, _id: 1, main_image: 1 })
            .lean()
            .exec()
            .then(docs => docs.map(doc => ({
                _id: doc._id.toString(),
                model_name: doc.vehicle_name,
                image: doc.main_image
            })));
    }

    // 3. 트림 목록 (네이티브 쿼리)
    async getTrimsByModel(vehicleId: string) {
        if (!vehicleId) return [];

        try {
            let vehicle: any = null;
            vehicle = await this.vehicleModel.collection.findOne({ _id: vehicleId } as any);

            if (!vehicle && Types.ObjectId.isValid(vehicleId)) {
                vehicle = await this.vehicleModel.collection.findOne({ _id: new Types.ObjectId(vehicleId) } as any);
            }

            if (!vehicle) return [];
            if (!vehicle.trims || vehicle.trims.length === 0) return [];

            return vehicle.trims.map((trim: any) => ({
                _id: trim._id,
                id: trim._id,
                name: trim.trim_name || trim.name, 
                trim_name: trim.trim_name,
                base_price: trim.price,
                price: trim.price,
                price_formatted: trim.price_formatted
            }));

        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // 4. 트림 상세 정보
    async getTrimDetail(trimId: string) {
        const decodedId = decodeURIComponent(trimId);
        
        if (!decodedId) throw new NotFoundException(`Trim ID가 비어있습니다.`);

        try {
            let vehicle: any = null;

            // ID 검색
            vehicle = await this.vehicleModel.collection.findOne({ 'trims._id': decodedId } as any);
            if (!vehicle && Types.ObjectId.isValid(decodedId)) {
                vehicle = await this.vehicleModel.collection.findOne({ 'trims._id': new Types.ObjectId(decodedId) } as any);
            }

            // 이름 검색 (Fallback)
            if (!vehicle) {
                vehicle = await this.vehicleModel.collection.findOne({ 'trims.trim_name': decodedId } as any);
            }
            if (!vehicle) {
                vehicle = await this.vehicleModel.collection.findOne({ 'trims.name': decodedId } as any);
            }

            if (!vehicle) {
                throw new NotFoundException(`데이터 없음: ${decodedId}`);
            }

            let trimData: any = null;
            if (vehicle.trims) {
                trimData = vehicle.trims.find((t: any) => 
                    (t._id && t._id.toString() === decodedId.toString())
                );
            }
            if (!trimData && vehicle.trims) {
                trimData = vehicle.trims.find((t: any) => 
                    t.trim_name === decodedId || t.name === decodedId
                );
            }
            
            if (!trimData) {
                throw new NotFoundException(`트림 추출 실패`);
            }

            return {
                ...trimData,
                _id: trimData._id,
                id: decodedId, 
                name: trimData.trim_name || trimData.name,
                base_price: trimData.price,
                model_name: vehicle.vehicle_name,
                manufacturer: vehicle.brand_name,
                image_url: vehicle.main_image,
                options: trimData.options || []
            };
        } catch (e) {
            if (e instanceof NotFoundException) throw e;
            throw new InternalServerErrorException("서버 오류");
        }
    }

    // 5. 비교 데이터 조회
    async getCompareData(ids: string) {
        if (!ids) return [];
        const idList = ids.split(',').filter(id => id.trim() !== '');
        const promises = idList.map(async (trimId) => {
            try { return await this.getTrimDetail(trimId); } catch (e) { return null; }
        });
        const results = await Promise.all(promises);
        return results.filter(item => item !== null);
    }

    // 6. ⭐ 비교 견적 상세 (옵션 매칭 디버깅 추가!)
    async getCompareDetails(trimId: string, optionIds: string[]) {
        console.log(`\n🕵️ [DEBUG] 옵션 매칭 시작! 트림ID: ${trimId}, 요청옵션: ${JSON.stringify(optionIds)}`);
        
        const detail = await this.getTrimDetail(trimId);
        
        let selectedOptions: any[] = [];
        const availableOptions = detail.options || [];

        console.log(`   👉 DB 보유 옵션 개수: ${availableOptions.length}개`);

        if (optionIds && optionIds.length > 0 && availableOptions.length > 0) {
             selectedOptions = availableOptions.filter((opt: any, index: number) => {
                 const realId = opt._id ? opt._id.toString() : '없음';
                 const tempId = `opt-${index}`;
                 
                 // 디버깅용 로그: 매칭 시도
                 // console.log(`      검사중[${index}]: realId=${realId}, tempId=${tempId} ...`);

                 // 1. 진짜 ID(_id) 매칭
                 if (opt._id && optionIds.includes(realId)) {
                     console.log(`      ✅ ID 매칭 성공! (${realId})`);
                     return true;
                 }
                 
                 // 2. 인덱스 매칭 (opt-0 등)
                 if (optionIds.includes(tempId)) {
                     console.log(`      ✅ 인덱스 매칭 성공! (${tempId}) -> ${opt.option_name || opt.name}`);
                     return true;
                 }

                 return false;
             });
        } else {
            console.log(`   ⚠️ 옵션 선택 불가 조건: 요청옵션(${optionIds.length}) / DB옵션(${availableOptions.length})`);
        }

        console.log(`   🏁 최종 선택된 옵션: ${selectedOptions.length}개`);

        const basePrice = detail.base_price || 0;
        const totalOptionPrice = selectedOptions.reduce((sum, opt) => {
            const price = opt.option_price || opt.price || 0;
            return sum + price;
        }, 0);

        return {
            car: {
                manufacturer: detail.manufacturer,
                model: detail.model_name,
                trim_name: detail.name,
                base_price: basePrice,
                image_url: detail.image_url,
            },
            selectedOptions: selectedOptions.map(opt => ({
                id: opt._id,
                name: opt.option_name || opt.name,
                price: opt.option_price || opt.price || 0
            })),
            totalOptionPrice,
            finalPrice: basePrice + totalOptionPrice,
        };
    }
}
