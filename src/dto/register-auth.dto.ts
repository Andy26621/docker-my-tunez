import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @MinLength(1)
  @MaxLength(15)
  @IsNotEmpty()
  full_name: string;
}
