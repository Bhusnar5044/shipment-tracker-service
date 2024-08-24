import { IsEmail, IsString } from 'class-validator';
import { Role } from '@/interfaces/users.interface';

export class CreateLoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
  
}

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public role: Role;
  
}