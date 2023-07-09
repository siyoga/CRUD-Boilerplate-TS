import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RefreshToken } from '../repositories/refreshToken.repository';
import { saveOne } from '../../../../utils/tools/saveOne';
import { NewEntity } from 'utils/types/NewEntity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async findOneById(id: string): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne({
      where: {
        userId: id,
      },
    });
  }

  async findOneByRefreshToken(refreshToken: string): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
      },
    });
  }

  async save(newRefreshToken: NewEntity<RefreshToken>): Promise<RefreshToken> {
    return await saveOne(this.refreshTokenRepository, newRefreshToken);
  }

  async remove(refreshToken: RefreshToken): Promise<DeleteResult> {
    return await this.refreshTokenRepository.delete(refreshToken);
  }
}
