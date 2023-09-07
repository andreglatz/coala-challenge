import { Module } from '@nestjs/common';

import { Tokens } from '@/users/settings/tokens';

import { CreateUserServiceImpl, FindUserServiceImpl } from '@/users/services';

import { CreateUserController } from '@/users/controllers';
import { CommonModule } from '@/common/common.module';
import { PrismaUserRepository } from '@/users/repositories';

@Module({
  imports: [CommonModule],
  controllers: [CreateUserController],
  providers: [
    { provide: Tokens.CreateUserService, useClass: CreateUserServiceImpl },
    { provide: Tokens.FindUserService, useClass: FindUserServiceImpl },
    { provide: Tokens.UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [Tokens.FindUserService],
})
export class UsersModule {}
