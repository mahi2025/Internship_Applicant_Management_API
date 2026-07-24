import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus, InternshipTrack } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum ApplicantSortField {
  CREATED_AT = 'createdAt',
  FULL_NAME = 'fullName',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryApplicantDto {
  @ApiPropertyOptional({ description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({ enum: InternshipTrack })
  @IsOptional()
  @IsEnum(InternshipTrack)
  track?: InternshipTrack;

  @ApiPropertyOptional({
    enum: ApplicantSortField,
    default: ApplicantSortField.CREATED_AT,
  })
  @IsOptional()
  @IsIn(Object.values(ApplicantSortField))
  sortBy: ApplicantSortField = ApplicantSortField.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsIn(Object.values(SortOrder))
  sortOrder: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
