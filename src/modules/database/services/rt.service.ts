import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { saveOne } from 'utils/tools/saveOne';
import { NewEntity } from 'utils/types/NewEntity';
import { User } from 'modules/database/repositories/users.repository';
import { RefreshToken } from '../repositories/rt.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private rtRepository: Repository<RefreshToken>,
  ) {}

  async findOneByHashedRt(hashedRt: string): Promise<RefreshToken | null> {
    return await this.rtRepository.findOne({
      where: {
        hashedRt,
      },
    });
  }

  async findOneUserId(user: User): Promise<RefreshToken | null> {
    return await this.rtRepository.findOne({
      where: {
        user,
      },
    });
  }

  async save(rt: NewEntity<RefreshToken>): Promise<RefreshToken | null> {
    return await saveOne(this.rtRepository, rt);
  }
}
