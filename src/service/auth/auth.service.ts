import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from 'src/dto/login-auth.dto';
import { UserEntity } from 'src/persistence/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtConstants } from './jwt.const';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity, 'postgres')
    private userRepository: Repository<UserEntity>,
    private jwtSevice: JwtService,
  ) {}

  public async login(data: LoginAuthDto) {
    const { email, password } = data;
    const findUser = await this.userRepository.findOneBy({
      email: email,
    });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);
    const payload = { id: findUser.id, username: findUser.email };
    const token = await this.jwtSevice.sign(payload, {
      secret: JwtConstants.key,
    });
    return { message: 'Login successful', user: findUser, token };
  }
}
