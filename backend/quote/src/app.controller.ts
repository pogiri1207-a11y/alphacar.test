import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('quote')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. 제조사 목록 조회
  @Get('makers')
  getMakers() {
    return this.appService.getManufacturers();
  }

  // 2. 모델 목록 조회
  @Get('models')
  getModels(@Query('makerId') makerId: string) {
    return this.appService.getModelsByManufacturer(makerId);
  }

  // 3. 트림 목록 조회
  @Get('trims')
  getTrims(@Query('modelId') modelId: string) {
    return this.appService.getTrimsByModel(modelId);
  }

  // 4. 상세 결과 조회
  @Get('detail')
  getDetail(@Query('trimId') trimId: string) {
    return this.appService.getTrimDetail(trimId);
  }

  // 5. [필수 추가] 비교 데이터 조회 API
  // 이 부분이 있어야 프론트엔드의 /quote/compare-data 요청을 처리할 수 있습니다.
  @Get('compare-data')
  getCompareData(@Query('ids') ids: string) {
    return this.appService.getCompareData(ids);
  }
}
