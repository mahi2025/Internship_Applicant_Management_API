import { PartialType, OmitType } from '@nestjs/swagger';
import { ApplicantDto } from './applicant.dto';

export class UpdateApplicantDto extends PartialType(
  OmitType(ApplicantDto, ['email'] as const),
) {}
