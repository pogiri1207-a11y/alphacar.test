import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VehicleOptionDocument = HydratedDocument<VehicleOption>;

@Schema({ collection: 'vehicleoptions' }) 
export class VehicleOption {
  @Prop()
  name: string; 

  @Prop()
  price: number;

  // [추가] 이 옵션이 연결된 트림의 ID
  // (DB에 실제 필드명이 trim_id 인지, vehicle_trim_id 인지 확인 필요. 보통 trim_id 사용)
  @Prop({ type: Types.ObjectId })
  trim_id: Types.ObjectId; 
}

export const VehicleOptionSchema = SchemaFactory.createForClass(VehicleOption);
