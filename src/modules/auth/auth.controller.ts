import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewUserDTO } from '../../dto/user.dto';
import { AuthLogic } from './auth.logic';
import { TokenPairDTO } from '../../dto/token.dto';
import { LocalAuthGuard } from './guard/localAuth.guard';
import { UserPublicData } from 'utils/types/UserDataData';

interface IRefresh {
  refreshToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authLogic: AuthLogic) {}

  @Post('/register')
  @HttpCode(201)
  async register(@Body() newUserDTO: NewUserDTO): Promise<void> {
    await this.authLogic.register(newUserDTO);
    return;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req: { user: UserPublicData }): Promise<TokenPairDTO> {
    return await this.authLogic.login(req.user.id);
  }

  @Post('/refresh')
  @HttpCode(200)
  async refresh(@Body() req: IRefresh): Promise<TokenPairDTO> {
    return await this.authLogic.refresh(req.refreshToken);
  }

  @Get('/confirm')
  @HttpCode(200)
  async confirm(@Query('token') token: string): Promise<void> {
    console.log(token);
    await this.authLogic.confirm(token);
    return;
  }
}
