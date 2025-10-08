/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EmployeeType } from 'src/enum/employeeManagement/employeeType.enum';

export class EmployeeRequestDto {
  @IsNotEmpty({ message: 'Employee name is required' })
  @IsString({ message: 'Employee name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsString({ message: 'Email address must be a string' })
  email_address: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsNotEmpty({ message: 'Employee type is required' })
  @IsEnum(EmployeeType, {
    message: 'Employee type must be one of the allowed values',
  })
  type: EmployeeType;
}
