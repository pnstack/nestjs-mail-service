import { Module } from '@nestjs/common';

import { PasswordService } from '@/modules/auth/password.service';


import { UserResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [],
  providers: [UsersService, PasswordService, UserResolver],
  exports: [UsersService],

})
export class UsersModule {}
