import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { CoreModule } from './core/core.module';
@Module({
  imports: [UserModule, AuthModule, CalendarModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
