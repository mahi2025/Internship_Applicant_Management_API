import { Test } from '@nestjs/testing';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { ApplicantsService } from './applicants.service';
import { PrismaService } from '../prisma/prisma.service';

type PrismaMock = {
  applicant: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

describe('ApplicantsService', () => {
  let service: ApplicantsService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = {
      applicant: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = moduleRef.get(ApplicantsService);
  });

  describe('updateStatus', () => {
    it('should block REJECTED -> ACCEPTED transition', async () => {
      prisma.applicant.findFirst.mockResolvedValue({
        id: '1',
        status: ApplicationStatus.REJECTED,
      });

      await expect(
        service.updateStatus('1', {
          status: ApplicationStatus.ACCEPTED,
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should allow PENDING -> SHORTLISTED transition', async () => {
      prisma.applicant.findFirst.mockResolvedValue({
        id: '1',
        status: ApplicationStatus.PENDING,
      });

      prisma.applicant.update.mockResolvedValue({
        id: '1',
        status: ApplicationStatus.SHORTLISTED,
      });

      const result = await service.updateStatus('1', {
        status: ApplicationStatus.SHORTLISTED,
      });

      expect(result.status).toBe(ApplicationStatus.SHORTLISTED);
    });

    it('should throw error if applicant does not exist', async () => {
      prisma.applicant.findFirst.mockResolvedValue(null);

      await expect(
        service.updateStatus('missing-id', {
          status: ApplicationStatus.SHORTLISTED,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete applicant', async () => {
      prisma.applicant.findFirst.mockResolvedValue({
        id: '1',
      });

      prisma.applicant.update.mockResolvedValue({
        id: '1',
        deletedAt: new Date(),
      });

      const result = await service.softDelete('1');

      expect(result.deletedAt).toBeDefined();
    });
  });
});
