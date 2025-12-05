// src/estimate/schemas/estimate.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EstimateDocument = Estimate & Document;

@Schema({ timestamps: true }) // 생성시간 자동 기록
export class Estimate {
  @Prop({ required: true })
  userId: string; // 사용자 ID (로그인 기능 없으면 하드코딩된 값 사용)

  @Prop({ required: true })
  type: string; // 'single' (단일) 또는 'compare' (비교)

  // 차량 정보 배열 (1대 또는 2대)
  @Prop({ type: [{ 
    manufacturer: String,
    model: String,
    trim: String,
    price: Number,
    options: [String], // 옵션 이름 목록
    image: String
  }] })
  cars: Record<string, any>[]; 

  @Prop()
  totalPrice: number; // 총 견적가
}

export const EstimateSchema = SchemaFactory.createForClass(Estimate);
