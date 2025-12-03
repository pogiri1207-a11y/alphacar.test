// alphacar-project/alphacar/alphacar-0f6f51352a76b0977fcac48535606711be26d728/backend/main/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getMainData() {
    // 1. 서비스에서 차량 목록을 먼저 가져옵니다.
    const carList = await this.appService.getCarList();

    // 2. 기존 데이터에 'cars' 필드를 추가하여 함께 반환합니다.
    return {
      welcomeMessage: 'Welcome to AlphaCar Home',
      
      searchBar: {
        isShow: true,
        placeholder: '찾는 차량을 검색해 주세요' 
      },

      banners: [
        { id: 1, text: '11월의 핫딜: 아반떼 즉시 출고', color: '#ff5555' },
        { id: 2, text: '겨울철 타이어 교체 가이드', color: '#5555ff' }
      ],
      shortcuts: ['견적내기', '시승신청', '이벤트'],

      // 👈 [핵심 수정] 프론트엔드가 기다리는 'cars' 데이터를 여기에 넣어줍니다.
      cars: carList 
    };
  }

  // (참고) 이 엔드포인트는 테스트용으로 남겨두셔도 됩니다.
  @Get('cars')
  async getCarList() {
    return await this.appService.getCarList();
  }
}
