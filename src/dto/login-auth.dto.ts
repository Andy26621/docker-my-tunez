import { MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @MinLength(5)
  @MaxLength(10)
  email: string;

  @MinLength(3)
  @MaxLength(8)
  password: string;
}
