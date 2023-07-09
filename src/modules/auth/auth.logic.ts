import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NewUserDTO } from '../../dto/user.dto';
import { UserLogic } from '../user/user.logic';
import { UserService } from '../database/services/user.service';
import { TokenPairDTO } from '../../dto/token.dto';
import { UserPrivateData } from 'utils/types/UserDataData';
import { RefreshTokenService } from '../database/services/refreshToken.service';
import { v4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

interface RefreshToken {
  token: string;
  userId: string;
}

interface RefreshTokenUnwrappedData {
  id: string;
}

@Injectable()
export class AuthLogic {
  private jwtSecret: string;

  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly JwtService: JwtService,
    private readonly userLogic: UserLogic,
  ) {
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async register({ username, email, password }: NewUserDTO): Promise<void> {
    await this.userLogic.create({
      username,
      email,
      password,
    });
  }

  async login(userId: string): Promise<TokenPairDTO> {
    const refreshToken: RefreshToken = {
      token: v4(),
      userId: userId,
    };

    await this.refreshTokenService.save(refreshToken);

    return {
      accessToken: this.JwtService.sign({ id: userId }, { expiresIn: '10d' }),
      refreshToken: refreshToken.token,
    };
  }

  async loginAttempt(user: UserPrivateData, password: string): Promise<void> {
    const { hashedPassword, salt } = user;

    const passwordVerified = this.userLogic.comparePasswords(
      password,
      salt,
      hashedPassword,
    );

    if (!passwordVerified) {
      throw new UnauthorizedException('Incorrect creds');
    }
  }

  async refresh(refreshToken: string): Promise<TokenPairDTO> {
    const existRefreshToken =
      await this.refreshTokenService.findOneByRefreshToken(refreshToken);

    if (!existRefreshToken) {
      throw new NotFoundException('Received refreshToken is not exist');
    }

    const newTokenPair = await this.login(existRefreshToken.userId);
    existRefreshToken.token = newTokenPair.refreshToken;
    this.refreshTokenService.save(existRefreshToken);

    return newTokenPair;
  }

  async confirm(token: string): Promise<void> {
    const confirmTokenInfo = this.decodeToken(token);
    const user = await this.userService.findOneById(confirmTokenInfo.id);

    user.activated = true;
    await this.userService.save(user);
  }

  decodeToken(token: string): RefreshTokenUnwrappedData {
    this.JwtService.verify(token, {
      secret: this.jwtSecret,
      ignoreExpiration: false,
    });

    return this.JwtService.decode(token) as RefreshTokenUnwrappedData;
  }

  // generateConfirmationToken(id: string): string {
  //   return this.JwtService.sign({ id: id }, { expiresIn: '10m' });
  // }
}
