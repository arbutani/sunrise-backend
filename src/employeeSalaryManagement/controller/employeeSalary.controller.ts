/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { EmployeeSalaryService } from '../service/employeeSalary.services';
import { EmployeeSalaryRequestDto } from '../dto/employeeSalaryRequest.dto';

@Controller('employee-salary')
export class EmployeeSalaryController {
  constructor(
    private readonly employeeSalaryService: EmployeeSalaryService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Post()
  async createEmployee(
    @Body() requestDto: EmployeeSalaryRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const EmployeeSalary =
        await this.employeeSalaryService.create(requestDto);
      return this.errorMessageService.success(
        EmployeeSalary,
        true,
        'Salary collected successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() requestDto: Partial<EmployeeSalaryRequestDto>, // Allow partial update
  ): Promise<SuccessResponseDto> {
    try {
      const updatedSalary = await this.employeeSalaryService.update(id, requestDto);
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

  @Get(':id')
  async getEmployee(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const EmployeeSalary = await this.employeeSalaryService.get(id);
      return this.errorMessageService.success(
        EmployeeSalary,
        true,
        'Employee Salary retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const EmployeeSalary =
        await this.employeeSalaryService.deleteEmployee(id);
      return this.errorMessageService.success(
        EmployeeSalary,
        true,
        'Employee Salary deleted successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get()
  async getAllEmployees(): Promise<any> {
    try {
      return await this.employeeSalaryService.getAllEmployees();
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
