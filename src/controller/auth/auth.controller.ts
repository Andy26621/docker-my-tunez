import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginAuthDto } from 'src/dto/login-auth.dto';
import { RegisterAuthDto } from 'src/dto/register-auth.dto';
import { AuthService } from 'src/service/auth/auth.service';
import { JwtAuthGuard } from 'src/service/auth/jwt-auth.guard';
import { UserService } from 'src/service/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto) {
    return await this.userService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('prueba')
  mostrar() {
    return 'todo ok';
  }
}
