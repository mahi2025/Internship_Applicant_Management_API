import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, minLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',  
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example:'adminPassword',
    minLength:8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
