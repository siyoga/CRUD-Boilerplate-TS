import { UserService } from '../database/services/user.service';

import { hashSync, compareSync } from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Tokens } from 'utils/types/Tokens';

import { User } from 'modules/database/repositories/users.repository';
import type { UserCredentials, UserGoogle, UserPublic } from 'utils/types/User';
import { RefreshTokenService } from 'modules/database/services/rt.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthLogic {
  private refreshTokenJwtSecret: string;
  private accessTokenJwtSecret: string;

  constructor(
    private readonly userService: UserService,
    private readonly rtService: RefreshTokenService,
    private readonly JwtService: JwtService,
    private readonly httpService: HttpService,
  ) {
    this.refreshTokenJwtSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenJwtSecret = process.env.JWT_ACCESS_SECRET;
  }

  async login(user: UserCredentials): Promise<Tokens> {
    const userExist = await this.isAccountExist(user);

    if (!userExist) {
      throw new BadRequestException('Invalid credentials.');
    }

    if (userExist.viaGoogle) {
      return this.generateTokenPair(userExist);
    }

    if (!compareSync(user.password, userExist.password)) {
      throw new BadRequestException('Invalid credentials.');
    }

    return await this.generateTokenPair(userExist);
  }

  async registerViaGoogle(authHeader: string): Promise<UserPublic> {
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new BadRequestException('Invalid token.');
    }

    const googleData = (
      await firstValueFrom(
        this.httpService.get<UserGoogle>(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
        ),
      )
    ).data;

    const userCreds: UserCredentials = {
      ...googleData,
      viaGoogle: true,
      username: googleData.email.split('@')[0],
      password: 'auth_by_google',
    };

    const userExist = await this.isAccountExist(userCreds);

    if (userExist) {
      return { email: userExist.email, username: userExist.username };
    }

    const newUser = await this.createEntity(userCreds);
    await this.userService.save(newUser);

    return { email: newUser.email, username: newUser.username };
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User is not exist.');
    }

    if (!compareSync(rt, user.refreshToken.hashedRt)) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    return await this.generateTokenPair(user);
  }

  // PRIVATE
  private async isAccountExist(
    userCreds: UserCredentials,
  ): Promise<User | false> {
    const existByUsername = await this.userService.findOneByUsername(
      userCreds.username,
    );

    if (existByUsername) {
      return existByUsername;
    }

    const existByEmail = await this.userService.findOneByEmail(userCreds.email);

    if (existByEmail) {
      return existByEmail;
    }

    return false;
  }

  private async generateTokenPair(user: User): Promise<Tokens> {
    const tokens: Tokens = {
      accessToken: this.JwtService.sign(
        { ...user },
        {
          expiresIn: '5m',
          secret: this.accessTokenJwtSecret,
        },
      ),
      refreshToken: this.JwtService.sign(
        { id: user.id },
        {
          expiresIn: '7d',
          secret: this.refreshTokenJwtSecret,
        },
      ),
    };

    if (!user.refreshToken) {
      const hashedRt = hashSync(
        tokens.refreshToken,
        Math.floor(Math.random() * 20),
      );

      this.rtService.save({ hashedRt, user });
    } else {
      const rtPayload = await this.rtService.findOneByHashedRt(
        user.refreshToken.hashedRt,
      );

      rtPayload.hashedRt = hashSync(
        tokens.refreshToken,
        Math.floor(Math.random() * 20),
      );

      this.rtService.save(rtPayload);
    }

    return tokens;
  }

  private async createEntity(
    userCreds: UserCredentials,
  ): Promise<UserCredentials> {
    console.log(userCreds);

    const hash = hashSync(userCreds.password, Math.floor(Math.random() * 20));

    const user: UserCredentials = {
      ...userCreds,
      password: hash,
    };

    return user;
  }
}
