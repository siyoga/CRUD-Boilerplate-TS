import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { saveOne } from 'utils/tools/saveOne';
import { NewEntity } from 'utils/types/NewEntity';
import { User } from 'modules/database/repositories/users.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async save(user: NewEntity<User>): Promise<User | null> {
    return await saveOne(this.userRepository, user);
  }
}
