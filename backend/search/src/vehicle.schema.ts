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

  // 제조사 참조 (DB: manufacturer_id)
  @Prop({ type: Types.ObjectId, ref: Manufacturer.name, required: true })
  manufacturer_id: Types.ObjectId;

  // 대표 이미지 URL (DB: image_url)
  @Prop()
  image_url: string;
  
  // 가격 (DB: base_price)
  @Prop()
  base_price: number; 
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
