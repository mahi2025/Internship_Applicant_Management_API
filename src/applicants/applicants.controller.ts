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
  Query,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantDto } from './dto/applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Public } from '../auth/decorators/public.decorator';
import { QueryApplicantDto } from './dto/query-applicant.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  create(@Body() dto: ApplicantDto) {
    return this.applicantsService.create(dto);
  }

  @Public()
  @Get()
  findAll(@Query() query: QueryApplicantDto) {
    return this.applicantsService.findAll(query);
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

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.applicantsService.updateStatus(id, dto);
  }

  @Patch(':id/notes')
  updateNotes(@Param('id') id: string, @Body() dto: UpdateNotesDto) {
    return this.applicantsService.updateNotes(id, dto);
  }
}
