import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const prisma = {
    admin: {
      findUnique: jest.fn(),
    },
  };

  const jwt = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    jwt.signAsync.mockResolvedValue('test-jwt-token');

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: PrismaService,
          useValue: prisma,
        },

        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('should reject unknown admin', async () => {
    prisma.admin.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'unknown@test.com',
        password: 'password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject wrong password', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);

    prisma.admin.findUnique.mockResolvedValue({
      id: '1',
      email: 'admin@test.com',
      password: passwordHash,
    });

    await expect(
      service.login({
        email: 'admin@test.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return token for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);

    prisma.admin.findUnique.mockResolvedValue({
      id: '1',
      email: 'admin@test.com',
      password: passwordHash,
    });

    const result = await service.login({
      email: 'admin@test.com',
      password: 'correct-password',
    });

    expect(result.accessToken).toBe('test-jwt-token');

    expect(result.admin).toEqual({
      id: '1',
      email: 'admin@test.com',
    });
  });
});
