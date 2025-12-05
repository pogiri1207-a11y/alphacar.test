// src/estimate/estimate.controller.ts
import { Controller, Get, Post, Body, Query, Delete, Param } from '@nestjs/common'; // ✅ Delete, Param 추가됨
import { EstimateService } from './estimate.service';

@Controller('estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  // 저장: POST /estimate
  @Post()
  create(@Body() body: any) {
    return this.estimateService.create(body);
  }

  // 목록 조회: GET /estimate/list?userId=...
  @Get('list')
  findAll(@Query('userId') userId: string) {
    return this.estimateService.findAll(userId);
  }

  // 개수 조회: GET /estimate/count?userId=...
  @Get('count')
  count(@Query('userId') userId: string) {
    return this.estimateService.count(userId);
  }

  // ✅ [신규 추가] 삭제 API
  // 요청 예시: DELETE http://192.168.0.160:3003/estimate/65a1b2c...
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.estimateService.delete(id);
  }
}
