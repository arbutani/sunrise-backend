/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class EmployeeSalaryRequestDto {
  @IsOptional()
  @IsUUID('4', { message: 'Employee ID must be a valid UUID' })
  employee_id: string;

  @IsNotEmpty({ message: 'Monthly salary is required' })
  @IsNumber({}, { message: 'Monthly salary must be a number' })
  monthly_salary: number;

  @IsNumber({}, { message: 'Working days must be a number' })
  @IsOptional()
  working_days?: number; // Defaults to 26 in DB

  @IsNumber({}, { message: 'Working hour must be a number' })
  @IsOptional()
  working_hour?: number; // Defaults to 8 in DB

  @IsNumber({}, { message: 'Overtime must be a number' })
  @IsOptional()
  over_time?: number;

  @IsNumber({}, { message: 'Leave day must be a number' })
  @IsOptional()
  leave_day?: number;

  @IsOptional()
  @IsString({ message: 'Reference number must be a string' })
  reference_number?: string;

  @IsOptional()
  @IsString({ message: 'Reference number date must be a string' })
  reference_number_date?: string;
}
