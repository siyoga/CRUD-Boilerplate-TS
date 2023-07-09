import { Module } from '@nestjs/common';
import { UserLogic } from './user.logic';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [UserLogic],
  controllers: [UserController],
  exports: [UserLogic],
})
export class UserModule {}
