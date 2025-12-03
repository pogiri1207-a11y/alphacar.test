// alphacar-project/alphacar/alphacar-0f6f51352a76b0977fcac48535606711be26d728/backend/main/src/manufacturer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type ManufacturerDocument = HydratedDocument<Manufacturer>;

// 'manufacturers' 컬렉션에 연결
@Schema({ collection: 'manufacturers' })
export class Manufacturer extends Document {
  // 제조사 이름 (프론트엔드 요구사항: name)
  @Prop({ required: true })
  name: string;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
