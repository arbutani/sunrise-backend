/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { EmployeeSalaryService } from '../service/employeeSalary.services';
import { EmployeeSalaryRequestDto } from '../dto/employeeSalaryRequest.dto';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';

//@UseGuards(JwtAuthGuard)
@Controller('employee-salary')
export class EmployeeSalaryController {
  constructor(
    private readonly employeeSalaryService: EmployeeSalaryService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Post()
  async createEmployeeSalary(
    @Body() requestDto: EmployeeSalaryRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const employeeSalary =
        await this.employeeSalaryService.create(requestDto);
      return this.errorMessageService.success(
        employeeSalary,
        true,
        'Salary created successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Put(':employee_id')
  async updateEmployeeSalary(
    @Param('employee_id') employee_id: string,
    @Body() requestDto: Partial<EmployeeSalaryRequestDto>,
  ): Promise<SuccessResponseDto> {
    try {
      const updatedSalary = await this.employeeSalaryService.update(
        employee_id,
        requestDto,
      );
      return this.errorMessageService.success(
        updatedSalary,
        true,
        'Employee Salary updated successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get('employee/:employee_id')
  async getEmployeeSalary(
    @Param('employee_id') employee_id: string,
  ): Promise<SuccessResponseDto> {
    try {
      const employeeSalary = await this.employeeSalaryService.get(employee_id);
      return this.errorMessageService.success(
        employeeSalary,
        true,
        'Employee Salary retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Delete(':id')
  async deleteEmployeeSalary(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.employeeSalaryService.deleteEmployeeSalary(id);
      return this.errorMessageService.success(
        result,
        true,
        'Employee Salary deleted successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get()
  async getAllEmployeeSalaries(): Promise<SuccessResponseDto> {
    try {
      const employeeSalaries =
        await this.employeeSalaryService.getAllEmployeeSalaries();
      return this.errorMessageService.success(
        employeeSalaries,
        true,
        'Employee salaries retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
