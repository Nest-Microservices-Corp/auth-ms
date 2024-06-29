import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config/envs';

@Module({
  controllers: [
    AuthController
  ],
  providers: [
    AuthService
  ],
  imports: [
    JwtModule.register({
      secret: envs.jwt_secret,
      signOptions: { expiresIn: envs.jwt_exp }
    })
  ],
  exports: [
    JwtModule
  ]
})
export class AuthModule {}
