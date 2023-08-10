import { Request } from 'express';
import { User } from 'modules/database/repositories/users.repository';

export interface NewRequest extends Request {
  user?: User;
  userId?: string;
  refreshToken?: string;
}
