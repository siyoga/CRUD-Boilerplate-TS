import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private refreshTokenJwtSecret: string;

  constructor(private jwtService: JwtService) {
    this.refreshTokenJwtSecret = process.env.JWT_REFRESH_SECRET;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractAccessTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenJwtSecret,
      });
      req['userId'] = payload;
      req['refreshToken'] = token;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractAccessTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
