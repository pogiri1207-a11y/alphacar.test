import { Controller, Get, Query, Logger, HttpStatus, UsePipes } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('vehicles')
export class VehiclesController {
    private readonly logger = new Logger(VehiclesController.name);

    constructor(private readonly appService: AppService) {
        console.log('--- VehiclesController 초기화 완료 ---');
    }

    // 1. 제조사 목록
    @Get('makers')
    getMakers() {
        this.logger.log(`[REQ] GET /vehicles/makers 요청 수신`);
        return this.appService.getManufacturers();
    }

    // 2. 모델 목록
    @Get('models')
    getModels(@Query('makerId') makerId: string) {
        this.logger.log(`[REQ] GET /vehicles/models 요청 수신`);
        return this.appService.getModelsByManufacturer(makerId);
    }

    // 3. 트림 목록 (여기가 핵심!)
    @Get('trims')
    getTrims(
        @Query('modelId') modelId: string,
        @Query('vehicleId') vehicleId: string
    ) {
        // 둘 중 하나라도 들어오면 ID로 인정
        const targetId = modelId || vehicleId;

        // 🚨 [수정 확인용] 이 로그가 떠야 수정된 코드가 도는 것입니다.
        this.logger.log(`[REQ] GET /vehicles/trims 요청 수신 (ID: ${targetId})`);

        if (!targetId || targetId === 'undefined') {
            this.logger.warn(`❌ ID가 전달되지 않았습니다.`);
            return [];
        }
        
        return this.appService.getTrimsByModel(targetId);
    }

    // 4. 상세 결과
    @Get('detail')
    async getTrimDetail(@Query('trimId') trimId: string) {
        this.logger.log(`[REQ] GET /vehicles/detail 요청 수신: trimId=${trimId}`);
        return this.appService.getTrimDetail(trimId);
    }

    // 5. 비교 데이터
    @Get('compare-data')
    getCompareData(@Query('ids') ids: string) {
        this.logger.log(`[REQ] GET /vehicles/compare-data 요청 수신: ids=${ids}`);
        return this.appService.getCompareData(ids);
    }

    // 6. 비교 견적 상세
    @Get('compare-details')
    async getCompareDetails(
      @Query('trimId') trimId: string,
      @Query('options') optionsString: string,
    ) {
        if (!trimId) return { statusCode: HttpStatus.BAD_REQUEST, message: 'trimId 필수' };
        const optionIds = optionsString ? optionsString.split(',').filter(id => id.trim() !== '') : [];
        return await this.appService.getCompareDetails(trimId, optionIds);
    }
}
