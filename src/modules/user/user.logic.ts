import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../database/services/user.service';
import { pbkdf2Sync } from 'pbkdf2';
import { randomBytes } from 'crypto';
import { NewUserDTO, UserNamesDTO } from 'src/dto/user.dto';
import { User } from '../database/repositories/user.repository';

type UserEntity = Omit<NewUserDTO, 'password'> & {
  salt: string;
  activated: boolean;
  hashedPassword: string;
};

@Injectable()
export class UserLogic {
  constructor(private readonly userService: UserService) {}

  async checkUsername(username: string): Promise<boolean> {
    const existUser = await this.userService.findOneByUsername(username);

    if (!existUser) {
      return true;
    }

    return false;
  }

  async changeUsername(username: string, newUsername: string): Promise<User> {
    const existUser = await this.userService.findOneByUsername(username);
    existUser.username = newUsername;
    await this.userService.save(existUser);

    return existUser;
  }

  async changeNames(username: string, names: UserNamesDTO): Promise<User> {
    const existUser = await this.userService.findOneByUsername(username);
    existUser.firstName = names.firstname;
    existUser.lastName = names.lastname;
    await this.userService.save(existUser);

    return existUser;
  }

  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const existUser = await this.userService.findOneByUsername(username);

    if (
      !this.comparePasswords(
        oldPassword,
        existUser.salt,
        existUser.hashedPassword,
      )
    ) {
      throw new BadRequestException('Invalid exist password');
    }

    existUser.hashedPassword = this.hashPassword(newPassword, existUser.salt);
    this.userService.save(existUser);
  }

  // *TODO* перенести логику в auth.logic
  async create(user: NewUserDTO): Promise<User> {
    const existUsername = await this.userService.findOneByUsername(
      user.username,
    );

    if (existUsername) {
      throw new BadRequestException('This username is already taken');
    }

    const existEmail = await this.userService.findOneByUsername(user.email);

    if (existEmail) {
      throw new BadRequestException('This email is already taken');
    }

    const newUser = await this.createEntity(user);
    return await this.userService.save(newUser);
  }

  comparePasswords(
    plainPassword: string,
    salt: string,
    hashedPassword: string,
  ): boolean {
    if (this.hashPassword(plainPassword, salt) === hashedPassword) {
      return true;
    }

    return false;
  }

  private hashPassword(receivedPasswordPlain: string, salt: string): string {
    return pbkdf2Sync(receivedPasswordPlain, salt, 32, 32, 'sha512').toString(
      'hex',
    );
  }

  private async createEntity({
    password,
    ...info
  }: NewUserDTO): Promise<UserEntity> {
    const salt = randomBytes(12).toString('hex');
    const hash = this.hashPassword(password, salt);

    const userEntity = {
      ...info,
      activated: true,
      salt: salt,
      hashedPassword: hash,
    };

    return userEntity;
  }
}
