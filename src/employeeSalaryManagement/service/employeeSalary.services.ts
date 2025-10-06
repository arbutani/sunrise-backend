/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Sequelize } from 'sequelize-typescript';
import { EmployeeSalary } from '../entity/employeeSalary.entity';
import { Employee } from 'src/employeeManagement/entity/employeeManagement.entity';
import { EmployeeSalaryRequestDto } from '../dto/employeeSalaryRequest.dto';
import { EmployeeSalaryDto } from '../dto/employeeSalary.dto';

@Injectable()
export class EmployeeSalaryService {
  constructor(
    @Inject('EMPLOYEE_SALARY_REPOSITORY')
    private readonly employeeSalaryRepository: typeof EmployeeSalary,
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeeRepository: typeof Employee,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async create(requestDto: EmployeeSalaryRequestDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const lastEmployeeSalary = await this.employeeSalaryRepository.findOne({
        order: [['createdAt', 'DESC']],
        transaction,
      });

      let nextSeriesNumber = 1;
      if (lastEmployeeSalary && lastEmployeeSalary.reference_number) {
        const match = lastEmployeeSalary.reference_number.match(/\d+/);
        if (match) {
          const lastSeriesNumber = parseInt(match[0], 10);
          if (!isNaN(lastSeriesNumber)) {
            nextSeriesNumber = lastSeriesNumber + 1;
          }
        }
      }

      const dateString = moment().format('DDMMYY');
      const newReferenceNumber = `ES${nextSeriesNumber}-${dateString}`;

      const fields = {
        employee_id: requestDto.employee_id,
        monthly_salary: requestDto.monthly_salary,
        working_days: requestDto.working_days,
        working_hour: requestDto.working_hour,
        over_time: requestDto.over_time,
        leave_day: requestDto.leave_day,
        reference_number: newReferenceNumber,
        reference_number_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const employeesalary = await this.employeeSalaryRepository.create(
        fields,
        { transaction },
      );

      await transaction.commit();
      return new EmployeeSalaryDto(employeesalary);
    } catch (error) {
      await transaction.rollback();
      throw this.errorMessageService.CatchHandler(error);
    }
  }
  async update(
    employee_id: string,
    requestDto: Partial<EmployeeSalaryRequestDto>,
  ) {
    try {
      const existingSalary = await this.employeeSalaryRepository.findOne({
        where: { employee_id },
      });
      if (!existingSalary) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee Salary not found',
          404,
        );
      }

      const updatedFields: any = { ...requestDto };
      if (updatedFields.reference_number_date) {
        updatedFields.reference_number_date = new Date(
          updatedFields.reference_number_date,
        );
      }
      if (updatedFields.updatedAt) {
        updatedFields.updatedAt = new Date(updatedFields.updatedAt);
      }

      await this.employeeSalaryRepository.update(updatedFields, {
        where: { employee_id },
      });

      const updatedSalary = await this.employeeSalaryRepository.findOne({
        where: { employee_id },
      });

      return new EmployeeSalaryDto(updatedSalary);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async get(employee_id: string) {
    try {
      const employeesalary = await this.employeeSalaryRepository.findOne({
        where: { employee_id: employee_id },
      });

      if (!employeesalary) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee salary not found',
          404,
        );
      }

      return new EmployeeSalaryDto(employeesalary);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteEmployee(id: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const employeesalary = await this.employeeSalaryRepository.findByPk(id, {
        transaction,
      });
      if (!employeesalary) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Employee not found',
          404,
        );
      }
      const deleted = await this.employeeSalaryRepository.destroy({
        where: { id: id },
        transaction,
      });
      if (deleted) {
        await transaction.commit();
        return { message: 'Employee salary deleted successfully' };
      } else {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to delete Employee Salary',
          200,
        );
      }
    } catch (error) {
      await transaction.rollback();
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllEmployees() {
    try {
      const employees = await this.employeeSalaryRepository.findAll();
      if (!employees || employees.length === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'NO Employee found',
          404,
        );
      }
      return employees.map((employee) => new EmployeeSalaryDto(employee));
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
