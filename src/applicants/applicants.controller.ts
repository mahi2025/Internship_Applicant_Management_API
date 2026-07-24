import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantDto } from './dto/applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  create(@Body() dto: ApplicantDto) {
    return this.applicantsService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.applicantsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApplicantDto) {
    return this.applicantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.applicantsService.softDelete(id);
  }
}
