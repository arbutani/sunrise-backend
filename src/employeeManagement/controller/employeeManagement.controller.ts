/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { EmployeeRequestDto } from '../dto/employeeManagementRequest.dto';
import { EmployeeService } from '../service/employeeManagement.service';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { Public } from 'src/JwtAuthGuard/public.decorator';
import { EmployeePutRequestDto } from '../dto/employeeManagementputRequest.dto';

//@UseGuards(JwtAuthGuard)
@Controller('employe-managment')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Post()
  async createEmployee(
    @Body() requestDto: EmployeeRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const employee_managment =
        await this.employeeService.createEmployee(requestDto);
      return this.errorMessageService.success(
        employee_managment,
        true,
        'Employee created successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const result = await this.employeeService.login(
        body.email,
        body.password,
      );
      return this.errorMessageService.success(
        result,
        true,
        'Login successful',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() requestDto: EmployeePutRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const employee_managment = await this.employeeService.updateEmployee(
        id,
        requestDto,
      );
      return this.errorMessageService.success(
        employee_managment,
        true,
        'Employee updated successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get(':id')
  async getEmployee(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const employee_managment = await this.employeeService.getEmployee(id);
      return this.errorMessageService.success(
        employee_managment,
        true,
        'Employee retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
  @Get()
  async getAllEmployees(@Query() query: any): Promise<any> {
    try {
      return await this.employeeService.getAllEmployees(query);
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
  @Delete(':id')
  async deleteEmployee(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const employee_managment = await this.employeeService.deleteEmployee(id);
      return this.errorMessageService.success(
        employee_managment,
        true,
        'Employee deleted successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
