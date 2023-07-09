export interface UserPublicData {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  activated: boolean;
}

export interface UserPrivateData extends UserPublicData {
  hashedPassword: string;
  salt: string;
}
