import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'testDB',
  entities: [User, Event],
  synchronize: true,
  autoLoadEntities: true,
};

export default config;
