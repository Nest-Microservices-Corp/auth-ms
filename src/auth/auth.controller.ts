import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SinginDto, registerDto } from './dto';

@Controller()
export class AuthController {
  constructor( private readonly authService: AuthService ) {}

  @MessagePattern('auth.singin.user')
  singin( @Payload() singinDto: SinginDto ) {
    return this.authService.singin( singinDto );
  }

  @MessagePattern('auth.register.user')
  register( @Payload() registerDto: registerDto ) {
    return this.authService.register( registerDto );
  }

}
