import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
