// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; 
import { AuthController } from './auth/auth.controller'; 
import { User } from './entities/user.entity';

import { AppController } from './app.controller'; // 👈 [추가]
import { AppService } from './app.service';     // 👈 [추가]

@Module({
  imports: [
    // MariaDB 연결 설정 (성공 코드 유지)
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: '211.46.52.151',
      port: 15432, // DB 포트
      username: 'team1',
      password: 'Gkrtod1@', // 계정 비밀번호
      database: 'team1',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    AuthModule, 
    
    // 👇 [핵심 수정] AppService가 사용하는 User 엔티티의 Repository를 등록합니다.
    TypeOrmModule.forFeature([User]), 
  ],
  // 👇 [수정] AppController를 등록하여 /mypage 경로를 활성화
  controllers: [AppController, AuthController], 
  // 👇 [수정] AppController가 사용하는 AppService를 등록
  providers: [AppService], 
})
export class AppModule {}
