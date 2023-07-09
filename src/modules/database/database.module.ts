import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './repositories/refreshToken.repository';
import { User } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { RefreshTokenService } from './services/refreshToken.service';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database:
          process.env.NODE_ENV === 'dev'
            ? process.env.POSTGRES_DB_TEST
            : process.env.POSTGRES_DB,
        logging: process.env.NODE_ENV === 'dev',
        synchronize: true,
        entities: [RefreshToken, User],
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken, User]),
  ],
  providers: [UserService, RefreshTokenService],
  exports: [UserService, RefreshTokenService],
})
export class DatabaseModule {}
