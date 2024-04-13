// core.module.ts
import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firestore.service';
import { FirebaseLocalService } from './firestore-local.service';

@Global()
@Module({
  providers: [FirebaseService, FirebaseLocalService],
  exports: [FirebaseService, FirebaseLocalService],
})
export class CoreModule {}
