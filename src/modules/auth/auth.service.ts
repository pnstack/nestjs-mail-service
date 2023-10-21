import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type UserPayload = {
  userId: number;
  role: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

  ) {}

  async validateAccessToken(authToken: string) {
    if (!authToken) return;
    const dt = this.jwtService.decode(authToken);
    if (!dt['id']) return;
    const user = {
      id: dt['id'],
    };
    return user;
  }

  async validateUser(userId: number): Promise<any> {
    return {
      id: userId,
    };
  }
}
