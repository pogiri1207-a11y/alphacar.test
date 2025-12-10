import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // MongoDB 연결 (기존)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get('DATABASE_USER')}:${config.get('DATABASE_PASSWORD')}@${config.get('DATABASE_HOST')}:${config.get('DATABASE_PORT')}/${config.get('DATABASE_NAME')}?authSource=admin`,
      }),
      inject: [ConfigService],
    }),
    // MariaDB 연결 (사용자 인증용)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'mariadb',
        host: config.get<string>('MARIADB_HOST') || '211.46.52.151',
        port: config.get<number>('MARIADB_PORT') || 15432,
        username: config.get<string>('MARIADB_USER') || 'team1',
        password: config.get<string>('MARIADB_PASS') || 'Gkrtod1@',
        database: config.get<string>('MARIADB_DB_NAME') || 'team1',
        entities: [User],
        synchronize: false, // 프로덕션에서는 false
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
