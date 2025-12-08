// src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  // 1. 찜 토글 (추가/삭제)
  async toggle(dto: ToggleFavoriteDto) {
    const { userId, vehicleId } = dto;
    const objectId = new Types.ObjectId(vehicleId);

    // 이미 찜했는지 확인
    const existing = await this.favoriteModel.findOne({ userId, vehicleId: objectId });

    if (existing) {
      // 이미 있으면 삭제 (찜 해제)
      await this.favoriteModel.deleteOne({ _id: existing._id });
      return { status: 'removed', message: '찜 목록에서 삭제되었습니다.' };
    } else {
      // 없으면 생성 (찜 하기)
      await new this.favoriteModel({ userId, vehicleId: objectId }).save();
      return { status: 'added', message: '찜 목록에 추가되었습니다.' };
    }
  }

  // 2. 특정 유저의 찜 목록 조회 (차량 정보 포함)
  async getFavorites(userId: string) {
    return this.favoriteModel.find({ userId })
      .populate('vehicleId') // Vehicle 컬렉션 조인
      .sort({ createdAt: -1 })
      .exec();
  }

  // 3. 특정 차량 찜 여부 확인 (모달 열 때 사용)
  async checkStatus(userId: string, vehicleId: string) {
    const count = await this.favoriteModel.countDocuments({ 
      userId, 
      vehicleId: new Types.ObjectId(vehicleId) 
    });
    return { isLiked: count > 0 };
  }
}
