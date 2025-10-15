/* eslint-disable no-irregular-whitespace */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Sequelize, Transaction } from 'sequelize';
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
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const findEmployee = await this.employeeRepository.findOne({
        where: {
          id: requestDto.employee_id,
        },
        transaction,
      });
      if (!findEmployee) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee not found.',
          200,
        );
      }

      const existingSalary = await this.employeeSalaryRepository.findOne({
        where: {
          employee_id: requestDto.employee_id,
        },
        transaction,
      });
      if (existingSalary) {
        throw this.errorMessageService.GeneralErrorCore(
          'Salary record already exists for this employee.',
          200,
        );
      }

      let fields = {
        employee_id: requestDto.employee_id,
        monthly_salary: requestDto.monthly_salary,
        working_days: requestDto.working_days,
        working_hour: requestDto.working_hour,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const employeeSalary = await this.employeeSalaryRepository.create(fields, {
        transaction,
      });
      if (employeeSalary) {
        await transaction.commit();
        status = true;
        return new EmployeeSalaryDto(employeeSalary);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to save employee salary data.',
          200,
        );
      }
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async update(
    employee_id: string,
    requestDto: Partial<EmployeeSalaryRequestDto>,
  ) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const existingSalary = await this.employeeSalaryRepository.findOne({
        where: {
          employee_id: employee_id,
        },
        transaction,
      });
      if (!existingSalary) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee salary not found',
          404,
        );
      }

      if (requestDto.employee_id && requestDto.employee_id !== employee_id) {
        const newEmployee = await this.employeeRepository.findOne({
          where: {
            id: requestDto.employee_id,
          },
          transaction,
        });
        if (!newEmployee) {
          throw this.errorMessageService.GeneralErrorCore(
            'New employee not found',
            200,
          );
        }

        const duplicateSalary = await this.employeeSalaryRepository.findOne({
          where: {
            employee_id: requestDto.employee_id,
          },
          transaction,
        });
        if (duplicateSalary) {
          throw this.errorMessageService.GeneralErrorCore(
            'Salary record already exists for the new employee',
            200,
          );
        }
      }

      let updateFields = {
        ...requestDto,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      await this.employeeSalaryRepository.update(updateFields, {
        where: { employee_id: employee_id },
        transaction,
      });

      const updatedEmployeeId = requestDto.employee_id || employee_id;
      const updatedSalary = await this.employeeSalaryRepository.findOne({
        where: { employee_id: updatedEmployeeId },
        transaction,
      });

      if (updatedSalary) {
        await transaction.commit();
        status = true;
        return new EmployeeSalaryDto(updatedSalary);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to retrieve updated salary record',
          200,
        );
      }
    } catch (error) {
      if (status === false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async get(id: string, type: string = 'employee_id') {
    let employeeSalaries;

    if (type === 'id') {
      const salary = await this.employeeSalaryRepository.findByPk(id);
      if (!salary) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee salary not found',
          404,
        );
      }
      return [new EmployeeSalaryDto(salary)];
    } else {
      employeeSalaries = await this.employeeSalaryRepository.findAll({
        where: { employee_id: id },
        order: [['createdAt', 'DESC']],
      });

      if (!employeeSalaries || employeeSalaries.length === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee salary not found',
          404,
        );
      }

      return employeeSalaries.map((salary) => new EmployeeSalaryDto(salary));
    }
  }
  async deleteEmployeeSalary(id: string) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const employeeSalary = await this.employeeSalaryRepository.findByPk(id, {
        transaction,
      });
      if (!employeeSalary) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee salary not found',
          404,
        );
      }
      const deleted = await this.employeeSalaryRepository.destroy({
        where: { id: id },
        transaction,
      });
      if (deleted) {
        await transaction.commit();
        status = true;
        return { message: 'Employee salary deleted successfully' };
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to delete employee salary',
          200,
        );
      }
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllEmployeeSalaries(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count, count_metadata] = await this.sequelize.query(
          count_query,
          {
            raw: true,
          },
        );
        const countRows = count as any;

        const [results, metadata] = await this.sequelize.query(query, {
          raw: true,
        });

        const listData = await Promise.all(
          results.map(async (employeeSalary: any) => {
            if (employeeSalary['createdAt']) {
              employeeSalary['createdAt'] = moment(
                employeeSalary['createdAt'],
              ).format('DD-MM-YYYY HH:mm A');
            }
            if (employeeSalary['updatedAt']) {
              employeeSalary['updatedAt'] = moment(
                employeeSalary['updatedAt'],
              ).format('DD-MM-YYYY HH:mm A');
            }
            return employeeSalary;
          }),
        );

        return {
          recordsTotal: Number(
            countRows.length > 0 && countRows[0]['count'] != ''
              ? countRows[0]['count']
              : 0,
          ),
          recordsFiltered: listData.length,
          data: listData,
        };
      } else {
        const employeeSalaries = await this.employeeSalaryRepository.findAll({
          include: [
            {
              model: Employee,
              attributes: ['id', 'name', 'email_address'],
            },
          ],
        });
        if (!employeeSalaries || employeeSalaries.length === 0) {
          throw this.errorMessageService.GeneralErrorCore(
            'No employee salaries found',
            404,
          );
        }
        return employeeSalaries.map((salary) => new EmployeeSalaryDto(salary));
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    try {
      const columns = [
        'id',
        'employee_id',
        'monthly_salary',
        'working_days',
        'working_hour',
      ];

      let where = '';

      if (requestDto.employee_id && requestDto.employee_id != '') {
        if (where != '') where += ` AND `;
        where += ` employee_id='${requestDto.employee_id}' `;
      }

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          for (const column of requestDto.columns) {
            if (column.searchable != null && column.searchable == 'true') {
              if (where != '') where += ` AND `;
              where += ` ${columns[column.data]} ILIKE '%${search}%' `;
            }
          }
        }
      }

      if (requestDto.id != null && requestDto.id != '') {
        if (where != '') where += ` AND `;
        where = ` employee_id='${requestDto.id}' `;
      }

      let query = `SELECT * FROM employee_salary_management`;
      let countQuery = `SELECT COUNT(*) FROM employee_salary_management`;

      if (where != '') {
        query += ` WHERE ${where}`;
        countQuery += ` WHERE ${where}`;
      }

      let orderBy = '';
      if (requestDto.order && requestDto.order.length > 0) {
        const order = requestDto.order[0];
        orderBy = `${columns[order.column]} ${order.dir}`;
      }

      if (!requestDto.id || requestDto.id === '') {
        if (orderBy === '') {
          orderBy = 'created_at DESC';
        }
        query += ` ORDER BY ${orderBy}`;
      }

      if (requestDto.length && requestDto.start) {
        if (requestDto.length != -1) {
          query += ` LIMIT ${requestDto.length} OFFSET ${requestDto.start}`;
        }
      } else {
        query += ` LIMIT 10 OFFSET 0`;
      }

      return { query: query, count_query: countQuery };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}