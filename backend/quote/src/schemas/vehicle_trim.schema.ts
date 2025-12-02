// backend/quote/src/schemas/vehicle_trim.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
// [추가된 부분] VehicleOption 클래스 import
import { VehicleOption } from './vehicle_option.schema'; 

export type VehicleTrimDocument = HydratedDocument<VehicleTrim>;

@Schema({ collection: 'vehicletrims' }) 
export class VehicleTrim {
  @Prop()
  name: string; 

  @Prop({ type: Types.ObjectId })
  vehicle_id: Types.ObjectId; 

  @Prop()
  base_price: number;

  @Prop()
  description: string;

  @Prop()
  image_url: string;

  // [수정] VehicleOption을 참조하도록 설정
  @Prop({ type: [{ type: Types.ObjectId, ref: 'VehicleOption' }] })
  options: VehicleOption[]; 
}

export const VehicleTrimSchema = SchemaFactory.createForClass(VehicleTrim);
