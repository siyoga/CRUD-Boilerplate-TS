import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './repositories/users.repository';
import { UserService } from './services/user.service';
import { RefreshToken } from './repositories/rt.repository';
import { RefreshTokenService } from './services/rt.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        logging: process.env.NODE_ENV === 'dev',
        synchronize: true,
        entities: [User, RefreshToken],
      }),
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  providers: [UserService, RefreshTokenService],
  exports: [UserService, RefreshTokenService],
})
export class DatabaseModule {}
