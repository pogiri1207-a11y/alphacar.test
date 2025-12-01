import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

// [중요] 주소를 /cars 로 지정
@Controller('cars') 
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. 전체 목록 조회 (주소: GET /cars)
  @Get()
  async getAllCars() {
    return this.appService.findAll();
  }

  // 2. 검색 기능 (주소: GET /cars/search?keyword=...)
  @Get('search')
  async searchCars(@Query('keyword') keyword: string) {
    return this.appService.search(keyword);
  }
}
