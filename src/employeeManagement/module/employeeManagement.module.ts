/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { EmployeeController } from '../controller/employeeManagement.controller';
import { employeeProvider } from '../provider/employeeManagement.provider';
import { EmployeeService } from '../service/employeeManagement.service';
import { JwtModule } from '@nestjs/jwt';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { EmployeeSalaryService } from 'src/employeeSalaryManagement/service/employeeSalary.services';
import { EmployeeSalaryController } from 'src/employeeSalaryManagement/controller/employeeSalary.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'MY_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [EmployeeController, EmployeeSalaryController],
  providers: [
    ...employeeProvider,
    EmployeeService,
    ErrorMessageService,
    JwtAuthGuard,
    EmployeeSalaryService,
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
