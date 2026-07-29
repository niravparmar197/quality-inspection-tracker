import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nirav' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'nirav@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password@123', minLength: 6 })
  @MinLength(6)
  password!: string;
}
