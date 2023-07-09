import { Request } from 'express';
import { UserPublicData } from './UserDataData';

export interface ExtendedRequest extends Request {
  user: UserPublicData;
}
