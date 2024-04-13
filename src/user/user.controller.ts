import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getAllUser')
  getAll() {
    return this.userService.getAllUsers();
  }
}
