import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.getAll();
  }

  @Get('/admins')
  async findAdmins() {
    return await this.userService.getAdmins();
  }

  @Get('clients')
  async findAClients() {
    return await this.userService.getClients();
  }
}
