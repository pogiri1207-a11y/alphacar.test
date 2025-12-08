import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RedisService } from './redis/redis.service';

// 공통 스키마 경로 사용
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    private readonly redisService: RedisService
  ) {}

  // 1. 전체 차량 조회
  async findAll(): Promise<Vehicle[]> {
    const results = await this.vehicleModel.find().exec();
    return results;
  }

  // 2. 특정 차량 상세 조회
  async findOne(id: string): Promise<Vehicle> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`요청된 차량 ID '${id}'의 형식이 유효하지 않습니다.`);
    }

    try {
      const vehicle = await this.vehicleModel.findById(id).exec();
      if (!vehicle) {
        throw new NotFoundException(`ID가 ${id}인 차량을 찾을 수 없습니다.`);
      }
      return vehicle;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`[DB ERROR] ID ${id} 조회 중 오류:`, error.message);
      throw new InternalServerErrorException('데이터베이스 조회 중 서버 내부 오류가 발생했습니다.');
    }
  }

  // ==========================================================
  // Redis 관련 로직
  // ==========================================================

  // 1. 최근 본 차량 저장
  async addRecentView(userId: string, vehicleId: string) {
    await this.redisService.addRecentView(userId, vehicleId);
    const count = await this.getRecentCount(userId);
    return { success: true, count };
  }

  // 2. 읽은 차량 개수 조회
  async getRecentCount(userId: string): Promise<number> {
    const client = this.redisService.getClient();
    const key = `recent_views:${userId}`;
    return await client.zcard(key);
  }

  // 3. 최근 본 차량 목록 조회
  async getRecentVehicles(userId: string): Promise<any[]> {
    if (!userId) return [];

    const vehicleIds = await this.redisService.getRecentViews(userId);

    if (!vehicleIds || vehicleIds.length === 0) {
      return [];
    }

    this.logger.log(`[Recent] 유저(${userId})의 최근 기록 ${vehicleIds.length}건 조회`);

    const promises = vehicleIds.map(async (id) => {
        try {
            let vehicle: any = null;
            
            vehicle = await this.vehicleModel.collection.findOne({ _id: id } as any);

            if (!vehicle && Types.ObjectId.isValid(id)) {
                vehicle = await this.vehicleModel.collection.findOne({ _id: new Types.ObjectId(id) } as any);
            }

            if (!vehicle) return null;

            const minPrice = vehicle.trims && vehicle.trims.length > 0
                ? Math.min(...vehicle.trims.map((t: any) => t.price || 0))
                : 0;

            return {
                _id: vehicle._id.toString(),
                name: vehicle.vehicle_name,
                brand: vehicle.brand_name,
                image: vehicle.main_image,
                price: minPrice,
            };
        } catch (e) {
            this.logger.error(`[Recent] ID(${id}) 조회 실패: ${e.message}`);
            return null;
        }
    });

    const results = await Promise.all(promises);
    return results.filter(item => item !== null);
  }

  // ==========================================================
  // [수정됨] 디버깅용: 트림 ID 혹은 차량 ID로 찾기
  // ==========================================================
  async findOneByTrimId(id: string): Promise<Vehicle> {
    console.log(`[Service] 🔍 findOneByTrimId 실행 시작: ${id}`);
    
    // 1. ObjectId 변환
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch (e) {
      console.error(`[Service] ❌ ID 형식 오류: ${id}`);
      throw new NotFoundException(`유효하지 않은 ID 형식입니다: ${id}`);
    }

    // 2. [핵심 수정] 트림 ID 또는 차량 ID로 검색 ($or 사용)
    console.log(`[Service] 💾 DB 쿼리 실행: 트림ID 또는 차량ID로 검색`);

    const vehicle = await this.vehicleModel.findOne({
      $or: [
        { 'trims._id': objectId },  // 1. 트림 ID로 찾기
        { '_id': objectId }         // 2. 차량 ID로 찾기 (Fallback 대응)
      ]
    }).exec();

    // 3. 결과 확인
    if (!vehicle) {
      console.log(`[Service] ⚠️ 결과: NULL (데이터 없음)`);
      throw new NotFoundException(`데이터 없음: ${id}`);
    }

    console.log(`[Service] 🎉 결과: 차량 찾음! (차량명: ${vehicle.vehicle_name})`);
    return vehicle;
  }
}
