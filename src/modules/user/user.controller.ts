import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtendedRequest } from 'utils/types/ExtendedRequest';
import { User } from '../database/repositories/user.repository';

import { UserLogic } from './user.logic';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userLogic: UserLogic) {}

  @Put('/changeUsername')
  @HttpCode(200)
  async changeUsername(
    @Req() request: ExtendedRequest,
    @Body() body,
  ): Promise<User> {
    return await this.userLogic.changeUsername(
      request.user.username,
      body.newUsername,
    );
  }

  @HttpCode(200)
  @Put('/setName')
  async setName(@Req() request: ExtendedRequest, @Body() body): Promise<User> {
    return await this.userLogic.changeNames(request.user.username, body);
  }

  @Put('/changePassword')
  @HttpCode(200)
  async changePassword(
    @Req() request: ExtendedRequest,
    @Body() body,
  ): Promise<void> {
    return await this.userLogic.changePassword(
      request.user.username,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Get('/checkUsername')
  @HttpCode(200)
  async checkUsernameAvailable(
    @Query('username') username: string,
  ): Promise<boolean> {
    return await this.userLogic.checkUsername(username);
  }
}
