import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthLogic } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [AuthLogic],
  controllers: [AuthController],
  exports: [AuthLogic],
})
export class AuthModule {}
