import { 
  Injectable, 
  NotFoundException,
  UnprocessableEntityException
 } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplicantDto } from './dto/applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Prisma, ApplicationStatus } from '@prisma/client';
import { QueryApplicantDto } from './dto/query-applicant.dto';
import { UpdateStatusDto
 } from './dto/update-status.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';

@Injectable()
export class ApplicantsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly notDeleted: Prisma.ApplicantWhereInput ={       
    deletedAt: null 
  };

  async create(dto: ApplicantDto) {
    return this.prisma.applicant.create({ 
        data: dto
     });
  }

  async findAll(query: QueryApplicantDto) {
    
    const { search, status, track, sortBy, sortOrder, page, limit } = query;

    const where: Prisma.ApplicantWhereInput = {
      ...this.notDeleted,
      ...(status && { status }),
      ...(track && { track }),
      ...(search && {
        OR: [
          {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    let orderBy: 
    Prisma.ApplicantOrderByWithRelationInput 
    | Prisma.ApplicantOrderByWithRelationInput[];

    if (sortBy === 'fullName') {
      orderBy = [
        {
          firstName: sortOrder,
        },
        {
          lastName: sortOrder,
        },
      ];
    } else {
      orderBy = {
        [sortBy]: sortOrder,
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.applicant.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.applicant.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const applicant = await this.prisma.applicant.findFirst({
      where: { id, ...this.notDeleted },
    });

    if (!applicant) {
      throw new NotFoundException(`Applicant with id "${id}" not found`);
    }

    return applicant;
  }

  async update(id: string, dto: UpdateApplicantDto) {
    
    await this.findOne(id);

    return this.prisma.applicant.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);

    return this.prisma.applicant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private readonly allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    [ApplicationStatus.PENDING]: [
      ApplicationStatus.SHORTLISTED,
      ApplicationStatus.REJECTED,
    ],
    [ApplicationStatus.SHORTLISTED]: [
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.REJECTED,
    ],
    [ApplicationStatus.ACCEPTED]: [], 
    [ApplicationStatus.REJECTED]: [],
  };

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const applicant = await this.findOne(id);

    if (applicant.status === dto.status) {
      return applicant;
    }

    const allowedNextStatuses = this.allowedTransitions[applicant.status];

    if (!allowedNextStatuses.includes(dto.status)) {
      throw new UnprocessableEntityException(
        `Cannot change status from "${applicant.status}" to "${dto.status}"`,
      );
    }

    return this.prisma.applicant.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async updateNotes(id: string, dto: UpdateNotesDto) {
    await this.findOne(id);

    return this.prisma.applicant.update({
      where: { id },
      data: { notes: dto.notes },
    });
  }
}
