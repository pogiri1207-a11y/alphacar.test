// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule, // 환경변수 사용을 위해 import
    AuthModule, // 인증 모듈 import (UserService 사용)
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
