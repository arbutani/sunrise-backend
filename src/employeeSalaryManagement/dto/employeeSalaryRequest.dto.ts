/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Is } from 'sequelize-typescript';

export class EmployeeSalaryRequestDto {
  @IsOptional()
  @IsUUID('4', { message: 'Employee ID must be a valid UUID' })
  employee_id: string;

  @IsNotEmpty({ message: 'Monthly salary is required' })
  @IsNumber({}, { message: 'Monthly salary must be a number' })
  monthly_salary: number;

  @IsNotEmpty({ message: 'Working days is required' })
  @IsNumber({}, { message: 'Working days must be a number' })
  working_days?: number;

  @IsNotEmpty({ message: 'Working hour is required' })
  @IsNumber({}, { message: 'Working hour must be a number' })
  working_hour?: number;
}
