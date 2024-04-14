import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { FirebaseService } from 'src/core/firestore.service';
// import { FirebaseLocalService } from 'src/core/firestore-local.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
@Injectable()
export class UserService {
  constructor(
    // private readonly firebaseLocalService: FirebaseLocalService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getAllUsers(): Promise<any[]> {
    return this.firebaseService.getAllData('users');
  }

  async findOneWithUserName(userName: string) {
    const users = await this.firebaseService.getAllData('users');
    return users.find((user) => user.email === userName);
  }

  async create(createUserDto: CreateUserDto, response: Response) {
    const bcryptPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = bcryptPassword;
    const users = await this.firebaseService.getAllData('users');
    const user = users.find((user) => user.email === createUserDto.email);

    if (user) {
      return response.status(HttpStatus.NOT_ACCEPTABLE).json({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Email already exist',
      });
    }
    const newUser = await this.firebaseService.add('users', createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return response.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'OK',
      data: result,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.firebaseService.update('users', id, updateUserDto);
  }
}
