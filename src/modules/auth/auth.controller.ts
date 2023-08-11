import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Headers,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthLogic } from './auth.service';
import { Tokens } from 'utils/types/Tokens';
import { UserPublic } from 'utils/types/User';
import { RefreshTokenGuard } from './guard/rt.guard';
import { NewRequest } from 'utils/types/Request';
import { User } from 'modules/database/repositories/users.repository';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authLogic: AuthLogic) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() userPublic: UserPublic): Promise<Tokens> {
    return await this.authLogic.login(userPublic);
  }

  @Get('/register/google')
  @HttpCode(201)
  async registerViaGoogle(
    @Headers('Authorization') authHeader: string,
  ): Promise<UserPublic> {
    return await this.authLogic.registerViaGoogle(authHeader);
  }

  @Get('/whoAmI')
  @HttpCode(200)
  async whoAmI(
    @Headers('Authorization') authHeader: string,
  ): Promise<Omit<User, 'password' | 'hashedRt'>> {
    return await this.authLogic.whoAmI(authHeader);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @HttpCode(200)
  async refresh(@Request() req: NewRequest): Promise<Tokens> {
    return await this.authLogic.refreshTokens(req.userId, req.refreshToken);
  }
}
