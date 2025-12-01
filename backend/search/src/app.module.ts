import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Car, CarSchema } from './car.schema';

@Module({
  imports: [
    // [수정됨] 사용자님이 제공한 192.168.0.201 서버의 naver_car_data_db로 연결
    // 계정: naver_car_data_user / 비번: naver_car_data_password
    MongooseModule.forRoot(
      'mongodb://naver_car_data_user:naver_car_data_password@192.168.0.201:27017/naver_car_data_db?authSource=admin'
    ),
    
    // Car 스키마 등록
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
