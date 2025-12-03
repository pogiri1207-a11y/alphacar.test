// alphacar-project/alphacar/alphacar-0f6f51352a76b0977fcac48535606711be26d728/backend/main/src/vehicle.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { Manufacturer } from './manufacturer.schema';

export type VehicleDocument = HydratedDocument<Vehicle>;

// 'vehicles' 컬렉션에 연결
@Schema({ collection: 'vehicles' })
export class Vehicle extends Document {
  // 차량 이름 (DB: model_name)
  @Prop({ required: true })
  model_name: string;

  // 👈 [수정] 제조사 참조 필드명을 실제 DB 필드명인 manufacturer_id로 변경
  @Prop({ type: Types.ObjectId, ref: Manufacturer.name, required: true })
  manufacturer_id: Types.ObjectId;

  // 대표 이미지 URL (DB: image_url)
  @Prop()
  image_url: string;
  
  // 👈 [수정] 가격 필드명을 실제 DB 필드명인 base_price로 변경
  @Prop()
  base_price: number; 
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
