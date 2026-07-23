import { ApiProperty } from '@nestjs/swagger';
import { InternshipTrack } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateApplicantDto {
  @ApiProperty({ 
        example: 'Mahlet Masresha'
    })
  @IsString()
  @Length(2, 100)
  fullName!: string;

  @ApiProperty({ 
        example: 'mahimasre@example.com' 
    })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
        example: '+2519001100', required: false 
    })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    enum: InternshipTrack,
    example: InternshipTrack.BACKEND_DEVELOPMENT,
  })
  @IsEnum(InternshipTrack)
  track!: InternshipTrack;
}
