import { IsString, MaxLength, MinLength, IsEmail } from 'class-validator';

export class NewUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  password: string;
}

export class UserNamesDTO {
  firstname: string;
  lastname: string;
}

export class UserPayloadDTO {
  username: string;
}
