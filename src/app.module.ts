import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookomarkModule } from './bookomark/bookomark.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, BookomarkModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
