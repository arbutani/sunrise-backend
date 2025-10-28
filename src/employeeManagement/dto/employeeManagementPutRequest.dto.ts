/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EmployeeSalaryRequestDto } from 'src/employeeSalaryManagement/dto/employeeSalaryRequest.dto';
import { EmployeeType } from 'src/shared/enum/employeeManagement/employeeType.enum';

export class EmployeePutRequestDto {
  @IsNotEmpty({ message: 'Employee name is required' })
  @IsString({ message: 'Employee name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsString({ message: 'Email address must be a string' })
  email_address: string;

  @IsOptional()
  @ValidateIf((o) => o.password !== undefined)
  @IsString({ message: 'Password must be a string' })
  password?: string;

  @IsNotEmpty({ message: 'Employee type is required' })
  @IsEnum(EmployeeType, {
    message: 'Employee type must be one of the allowed values',
  })
  type: EmployeeType;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeSalaryRequestDto)
  salary?: EmployeeSalaryRequestDto;
}
