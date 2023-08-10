import { User } from 'modules/database/repositories/users.repository';

export interface UserGoogle {
  email: string;
  emailVerified: string;
  fullName: string;
  picture: string;
  givenName: string;
  familyName: string;
  locale: string;
}

export type UserCredentials = Partial<
  Omit<User, 'createdAt' | 'updatedAt' | 'id' | 'refreshToken'>
>;

export type UserPublic = Pick<User, 'email' | 'username'>;
