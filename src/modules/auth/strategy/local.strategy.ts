import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/database/services/user.service';
import { UserPublicData } from 'utils/types/UserDataData';
import { AuthLogic } from '../auth.logic';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authLogic: AuthLogic,
    private readonly userService: UserService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<UserPublicData> {
    const existUser = await this.userService.findOneByUsername(username);

    if (!existUser) {
      throw new UnauthorizedException('Incorrect creds');
    }

    await this.authLogic.loginAttempt(existUser, password);

    // remove private paramaters from final data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, salt, ...authInfo } = existUser;

    return authInfo;
  }
}
