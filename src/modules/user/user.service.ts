import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/database/tenancy/entities/user.entity';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor(
    @Inject(REQUEST)
    request: Request & { dataSource: DataSource },
  ) {
    this.userRepository = request.dataSource.getRepository(User);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user, ${updateUserDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
