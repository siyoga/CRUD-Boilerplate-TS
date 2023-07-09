import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthLogic } from 'src/modules/auth/auth.logic';
import { UserService } from 'src/modules/database/services/user.service';
import { ExtendedRequest } from 'utils/types/ExtendedRequest';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly authLogic: AuthLogic,
    private readonly userService: UserService,
  ) {}

  async use(req: ExtendedRequest, next: NextFunction) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const accessTokenUnwrapped = this.authLogic.decodeToken(accessToken);

    // checking that the user exists in the system
    const existUser = await this.userService.findOneById(
      accessTokenUnwrapped.id,
    );

    if (!existUser) {
      throw new NotFoundException('User not found.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, salt, ...authInfo } = existUser;

    req.user = authInfo;
    next();
  }
}
