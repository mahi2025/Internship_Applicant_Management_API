import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const grouped = await this.prisma.applicant.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { status: true },
    });

    const counts: Record<ApplicationStatus, number> = {
      [ApplicationStatus.PENDING]: 0,
      [ApplicationStatus.SHORTLISTED]: 0,
      [ApplicationStatus.ACCEPTED]: 0,
      [ApplicationStatus.REJECTED]: 0,
    };

    for (const row of grouped) {
      counts[row.status] = row._count.status;
    }

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    return {
      total,
      pending: counts.PENDING,
      shortlisted: counts.SHORTLISTED,
      accepted: counts.ACCEPTED,
      rejected: counts.REJECTED,
    };
  }
}