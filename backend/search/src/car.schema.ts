// backend/search/src/car.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

// [중요] 실제 DB 컬렉션 이름과 일치해야 함
@Schema({ collection: 'navercardatas' })
export class Car {
  // 1. 기본 정보
  @Prop()
  vehicle_name: string; // 차량 이름 (예: 그랜저)

  @Prop()
  manufacturer: string; // 제조사 (예: 현대)

  @Prop()
  model_year: number;   // 연식 (예: 2025)

  @Prop()
  fuel_type: string;    // 연료 (예: 가솔린, 하이브리드)

  // 2. 가격 및 차급 요약 정보
  @Prop({ type: Object })
  summary: {
    category: string;       // 차급 (예: 대형 세단)
    price_range: {
      min: number;
      max: number;
    };
  };

  // 3. 상세 제원 (연비, 출력, 크기 등) - [중요] 이게 있어야 제원이 보입니다!
  @Prop({ type: Object })
  specifications: {
    fuel_efficiency: {
      combined: string; // 복합연비
      city: string;     // 도심연비
      highway: string;  // 고속연비
    };
    engine: {
      type: string;         // 엔진 형식
      displacement: string; // 배기량
      max_power: string;    // 최고출력
      max_torque: string;   // 최대토크
    };
    dimensions: {
      length: string;   // 전장
      width: string;    // 전폭
      height: string;   // 전고
      wheelbase: string;// 축거
    };
  };

  // 4. 이미지 정보
  @Prop({ type: Object })
  photos: {
    representative_image: {
      url: string;
      color_name: string;
    };
    // 필요한 경우 exterior, interior 배열도 추가 가능
  };

  // 5. 트림 정보 (필요시 사용)
  @Prop({ type: Array })
  trims: any[];
}

export const CarSchema = SchemaFactory.createForClass(Car);
