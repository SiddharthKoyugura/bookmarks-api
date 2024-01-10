import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookomarkModule } from './bookomark/bookomark.module';

@Module({
  imports: [AuthModule, UserModule, BookomarkModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
