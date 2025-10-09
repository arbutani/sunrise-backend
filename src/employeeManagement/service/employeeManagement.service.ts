/* eslint-disable prettier/prettier */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { literal, Op, Sequelize } from 'sequelize';
import { Employee } from '../entity/employeeManagement.entity';
import { EmployeeRequestDto } from '../dto/employeeManagementRequest.dto';
import { EmployeeDto } from '../dto/employeeManagement.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
import { EmployeePutRequestDto } from '../dto/employeeManagementputRequest.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('EMPLOYEE_SALARY_REPOSITORY')
    private readonly employeeSalaryRepository: typeof EmployeeSalary,
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeeRepository: typeof Employee,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
    private readonly jwtService: JwtService,
  ) {}

  async createEmployee(requestDto: EmployeeRequestDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { email_address: requestDto.email_address },
      });

      if (existingEmployee) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Employee with this email address already exists',
          200,
        );
      }

      const lastEmployee = await this.employeeRepository.findOne({
        order: [['createdAt', 'DESC']],
      });

      let nextSeriesNumber = 1;
      if (lastEmployee && lastEmployee.reference_number) {
        const match = lastEmployee.reference_number.match(/\d+/);
        if (match) {
          const lastSeriesNumber = parseInt(match[0], 10);
          if (!isNaN(lastSeriesNumber)) {
            nextSeriesNumber = lastSeriesNumber + 1;
          }
        }
      }

      const dateString = moment().format('DDMMYY');
      const newReferenceNumber = `E${nextSeriesNumber}-${dateString}`;
      const hashedPassword = await bcrypt.hash(requestDto.password, 10);

      const employeeFields = {
        reference_number: newReferenceNumber,
        reference_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        name: requestDto.name,
        email_address: requestDto.email_address,
        password: hashedPassword,
        type: requestDto.type,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        deletedAt: null,
      } as any;

      const employee = await this.employeeRepository.create(employeeFields, {
        transaction,
      });

      if (requestDto.salary) {
        const salaryData = {
          employee_id: employee.id,
          monthly_salary: requestDto.salary.monthly_salary,
          working_days: requestDto.salary.working_days,
          working_hour: requestDto.salary.working_hour,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        await this.employeeSalaryRepository.create(salaryData as any, {
          transaction,
        });
      }

      await transaction.commit();

      const newEmployee = await this.employeeRepository.findByPk(employee.id);
      const employeeSalary = await this.employeeSalaryRepository.findOne({
        where: { employee_id: employee.id },
      });

      if (!newEmployee) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch created employee',
          500,
        );
      }

      const responseData = {
        ...newEmployee.toJSON(),
        salaries: employeeSalary ? [employeeSalary.toJSON()] : [],
      };

      return new EmployeeDto(responseData);
    } catch (error) {
      await transaction.rollback().catch(() => {});
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { email_address: email },
      });

      if (!employee) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: employee.id,
        email: employee.email_address,
        type: employee.type,
        username: employee.name,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: 'MY_SECRET_KEY',
        expiresIn: '1h',
      });

      return {
        access_token: token,
        employee: new EmployeeDto(employee),
        type: employee.type,
      };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async updateEmployee(id: string, requestDto: EmployeePutRequestDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const oldEmployee = await this.employeeRepository.findByPk(id);
      if (!oldEmployee) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Employee not found',
          404,
        );
      }

      if (requestDto.email_address !== oldEmployee.email_address) {
        const findEmployee = await this.employeeRepository.findOne({
          where: {
            email_address: requestDto.email_address,
            id: { [Op.ne]: id },
          },
        });

        if (findEmployee) {
          await transaction.rollback();
          throw this.errorMessageService.GeneralErrorCore(
            'Employee with this email address already exists',
            200,
          );
        }
      }

      const hashedPassword = requestDto.password
        ? await bcrypt.hash(requestDto.password, 10)
        : oldEmployee.password;

      const employeeFields = {
        name: requestDto.name,
        email_address: requestDto.email_address,
        type: requestDto.type,
        password: hashedPassword,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const [updatedCount] = await this.employeeRepository.update(
        employeeFields,
        { where: { id }, transaction },
      );

      if (updatedCount === 0) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to update employee',
          200,
        );
      }

      if (requestDto.salary) {
        const salaryData = {
          employee_id: id,
          monthly_salary: requestDto.salary.monthly_salary,
          working_days: requestDto.salary.working_days,
          working_hour: requestDto.salary.working_hour,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        await this.employeeSalaryRepository.create(salaryData as any, {
          transaction,
        });
      }

      await transaction.commit();

      const updatedEmployee = await this.employeeRepository.findByPk(id);

      const employeeSalary = await this.employeeSalaryRepository.findOne({
        where: { employee_id: id },
        order: [['createdAt', 'DESC']],
      });

      if (!updatedEmployee) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch updated employee',
          500,
        );
      }

      const employeePlain = updatedEmployee.get({ plain: true });
      const salaryPlain = employeeSalary
        ? employeeSalary.get({ plain: true })
        : null;

      const responseData = {
        ...employeePlain,
        salaries: salaryPlain ? [salaryPlain] : [],
      };

      return new EmployeeDto(responseData);
    } catch (error) {
      await transaction.rollback().catch(() => {});
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getEmployee(id: string) {
    try {
      const employee = await this.employeeRepository.findByPk(id);
      if (!employee) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee not found',
          404,
        );
      }
      return new EmployeeDto(employee);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    try {
      const columns = [
        'id',
        'reference_number',
        'name',
        'email_address',
        'type',
        'createdAt',
      ];

      let where = 'deleted_at IS NULL';

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          for (const column of requestDto.columns) {
            if (column.searchable != null && column.searchable == 'true') {
              if (where != '') {
                where += ` AND `;
              }
              where += ` ${columns[column.data]} ILIKE '%${search}%' `;
            }
          }
        }
      }

      if (requestDto.type && requestDto.type != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` type='${requestDto.type}' `;
      }

      if (requestDto.name && requestDto.name != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` name ILIKE '%${requestDto.name}%' `;
      }

      let query = `SELECT * FROM employees`;
      let countQuery = `SELECT COUNT(*) FROM employees`;

      if (where != '') {
        query += ` WHERE ${where}`;
        countQuery += ` WHERE ${where}`;
      }

      let orderBy = '';
      if (requestDto.order && requestDto.order.length > 0) {
        for (const order of requestDto.order) {
          if (orderBy != '') {
            orderBy += ',';
          }
          orderBy += `${order.column} ${order.dir}`;
        }
        const order = requestDto.order[0];
        orderBy = `${columns[order.column]} ${order.dir}`;
      }

      if (orderBy == '') {
        orderBy = 'created_at DESC';
      }

      query += ` ORDER BY ${orderBy}`;

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

  async getAllEmployees(requestDto?: any) {
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
          results.map(async (employee: any) => {
            if (employee['createdAt']) {
              employee['createdAt'] = moment(employee['createdAt']).format(
                'DD-MM-YYYY HH:mm A',
              );
            }
            if (employee['updatedAt']) {
              employee['updatedAt'] = moment(employee['updatedAt']).format(
                'DD-MM-YYYY HH:mm A',
              );
            }
            if (employee['reference_date']) {
              employee['reference_date'] = moment(
                employee['reference_date'],
              ).format('DD-MM-YYYY');
            }
            return employee;
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
        const employees = await this.employeeRepository.findAll({
          where: literal('deleted_at IS NULL') as any,
        });
        if (!employees || employees.length === 0) {
          throw this.errorMessageService.GeneralErrorCore(
            'No employees found',
            404,
          );
        }
        return employees.map((employee) => new EmployeeDto(employee));
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteEmployee(id: string) {
    try {
      const [updatedRows] = await this.employeeRepository.update(
        { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') } as any,
        {
          where: {
            id: id,
            deletedAt: { [Op.is]: null },
          } as any,
        },
      );

      if (updatedRows === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee not found',
          404,
        );
      }

      return { message: 'Employee deleted successfully' };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
