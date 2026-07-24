import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.SHORTLISTED,
  })
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}
