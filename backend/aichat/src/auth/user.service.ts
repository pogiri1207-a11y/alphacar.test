// src/auth/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findBySocialId(socialId: string): Promise<User | null> {
    if (!socialId) {
      return null;
    }
    return this.userRepository.findOne({ where: { socialId } });
  }

  async getUserNameBySocialId(socialId: string): Promise<string> {
    const user = await this.findBySocialId(socialId);
    if (!user) {
      return '고객님';
    }
    // 닉네임 우선, 없으면 이메일, 둘 다 없으면 기본값
    return user.nickname || user.email?.split('@')[0] || '고객님';
  }
}

