import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SinginDto, registerDto } from './dto';
import { PrismaClient, User } from '@prisma/client';
import { validate as ISUUID } from 'uuid';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  
  private readonly _logger = new Logger("AuthService")

  async onModuleInit() {
    await this.$connect();
    this._logger.log('Mongo DB connected !!!');
  }

  async singin( singinDto: SinginDto ) {
    
    try {

      
      
    } catch (error) {
      
    }

  }

  async findUser( pattern: string ): Promise<User> {
    
    const where: any = {};

    if( ISUUID( pattern ) ) {
      where.id = pattern;
    } else {
      where.email = pattern;
    }

    const userFind = await this.user.findUnique({
      where
    });
    
    return userFind;

  }

  async register( registerDto: registerDto ) {
    
    try {

      const { username, password, name } = registerDto;

      const userRepit = await this.findUser( username );

      if( userRepit ) {
        throw new RpcException({
          status: HttpStatus.FORBIDDEN,
          message: `Exists one user by username #${ username }`
        });
      }

      const newUser = await this.user.create({
        data: {
          email: username,
          password,
          name
        }
      });

      return {
        user: newUser,
        token: 'ABC'
      };

    } catch (error) {
      throw new RpcException( error );
    }
    
  }
  
}
