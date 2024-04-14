import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { FirebaseService } from 'src/core/firestore.service';
// import { FirebaseLocalService } from 'src/core/firestore-local.service';
import * as bcrypt from 'bcrypt';
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

  async create(createUserDto: CreateUserDto) {
    const bcryptPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = bcryptPassword;
    const newUser = await this.firebaseService.add('users', createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.firebaseService.update('users', id, updateUserDto);
  }
}
