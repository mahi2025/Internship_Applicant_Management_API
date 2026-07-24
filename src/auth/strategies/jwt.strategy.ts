import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: 
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>('config.jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {

    const admin = await this.authService.validateAdminById(payload.sub);
    
    console.log("admin", admin);

    return { 
      id: admin.id, 
      email: admin.email 
    };
  }
}
