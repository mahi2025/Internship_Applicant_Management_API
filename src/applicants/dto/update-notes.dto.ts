import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateNotesDto {
  @ApiProperty({
    example: 'This is the updated note',
  })
  @IsString()
  @MaxLength(1000, { 
        message: 'Notes must not exceed 1000 characters' 
    })
  notes!: string;
}
