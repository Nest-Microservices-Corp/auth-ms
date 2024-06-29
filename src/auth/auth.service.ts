import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SinginDto, registerDto } from './dto';
import { PrismaClient, User } from '@prisma/client';
import { validate as ISUUID } from 'uuid';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IPayloadToken } from './interfaces';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  
  private readonly _logger = new Logger("AuthService")

  constructor(

    private readonly _jwtService: JwtService

  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this._logger.log('Mongo DB connected !!!');
  }

  async singin( singinDto: SinginDto ) {
    
    try {

      const { username, password } = singinDto;

      const userFind = await this.findUser( username );

      if( !userFind ) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Username/password is invalid`
        });
      }

      const { password: __, ...user } = userFind;
      
      if( !bcrypt.compareSync( password, __ ) ) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Username/password is invalid`
        });
      }

      return {
        user,
        token: this.buildToken({ id: user.id, email: user.email })
      };
      
    } catch (error) {
      throw new RpcException( error );
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
          password: bcrypt.hashSync( password, 10 ),
          name
        }
      });

      delete newUser.password;

      return {
        user: newUser,
        token: this.buildToken( { id: newUser.id, email: newUser.email } )
      };

    } catch (error) {
      throw new RpcException( error );
    }
    
  }

  buildToken( payload: IPayloadToken ): string {
    return this._jwtService.sign( payload );
  }
  
}
