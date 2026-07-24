import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplicantDto } from './dto/applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Prisma } from '@prisma/client';

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

  async findAll() {
    
    return this.prisma.applicant.findMany({
      where: this.notDeleted,
      orderBy: { createdAt: 'desc' },
    });
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
}
