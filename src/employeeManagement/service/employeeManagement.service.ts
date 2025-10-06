/* eslint-disable prettier/prettier */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Employee } from '../entity/employeeManagement.entity';
import { EmployeeRequestDto } from '../dto/employeeManagementRequest.dto';
import { EmployeeDto } from '../dto/employeeManagement.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';

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

  async createemployee(requestDto: EmployeeRequestDto) {
    try {
      const findEmployee = await this.employeeRepository.findOne({
        where: { email_address: requestDto.email_address },
      });

      if (findEmployee) {
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
        reference_number_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        employee_name: requestDto.employee_name,
        email_address: requestDto.email_address,
        password: hashedPassword,
        employee_type: requestDto.employee_type,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const employee = await this.employeeRepository.create(employeeFields);

      const newEmployee = await this.employeeRepository.findByPk(employee.id);
      return new EmployeeDto(newEmployee);
    } catch (error) {
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
        type: employee.employee_type,
        username: employee.employee_name,
      };
      const token = await this.jwtService.signAsync(payload, {
        secret: 'MY_SECRET_KEY',
        expiresIn: '1h',
      });

      return {
        access_token: token,
        employee: new EmployeeDto(employee),
        employee_type: employee.employee_type,
      };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async updateEmployee(id: string, requestDto: EmployeeRequestDto) {
    try {
      const oldEmployee = await this.employeeRepository.findByPk(id);

      if (!oldEmployee) {
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
        employee_name: requestDto.employee_name,
        email_address: requestDto.email_address,
        employee_type: requestDto.employee_type,
        password: hashedPassword,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const [updatedCount] = await this.employeeRepository.update(
        employeeFields,
        { where: { id } },
      );

      if (updatedCount > 0) {
        const updatedEmployee = await this.employeeRepository.findByPk(id);
        return new EmployeeDto(updatedEmployee);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to update employee',
          200,
        );
      }
    } catch (error) {
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

  async getAllEmployees(query: any) {
    try {
      const parsedQuery: any = {
        start: query.start || '0',
        length: query.length || '10',
        draw: query.draw || '1',
        search: {},
        order: [],
        columns: [],
      };

      if (query['search[value]']) {
        parsedQuery.search.value = query['search[value]'];
        parsedQuery.search.regex = query['search[regex]'] || 'false';
      }

      let orderIndex = 0;
      while (query[`order[${orderIndex}][column]`]) {
        parsedQuery.order.push({
          column: query[`order[${orderIndex}][column]`],
          dir: query[`order[${orderIndex}][dir]`] || 'asc',
        });
        orderIndex++;
      }

      let columnIndex = 0;
      while (query[`columns[${columnIndex}][data]`]) {
        parsedQuery.columns.push({
          data: query[`columns[${columnIndex}][data]`],
          name: query[`columns[${columnIndex}][name]`] || '',
          searchable: query[`columns[${columnIndex}][searchable]`] || 'true',
          orderable: query[`columns[${columnIndex}][orderable]`] || 'true',
          search: {
            value: query[`columns[${columnIndex}][search][value]`] || '',
            regex: query[`columns[${columnIndex}][search][regex]`] || 'false',
          },
        });
        columnIndex++;
      }

      const { start, length, search, order, columns } = parsedQuery;

      const whereCondition = {};
      if (search && search.value) {
        whereCondition[Op.or] = [
          { employee_name: { [Op.like]: `%${search.value}%` } },
          { email_address: { [Op.like]: `%${search.value}%` } },
        ];
      }

      const orderCondition: any[] = [];
      if (
        order &&
        order.length > 0 &&
        columns &&
        columns.length > order[0].column
      ) {
        const orderByColumn = columns[order[0].column].data;
        const orderDirection = order[0].dir.toUpperCase();

        if (orderByColumn) {
          orderCondition.push([orderByColumn, orderDirection]);
        }
      }

      const recordsTotal = await this.employeeRepository.count({
        distinct: true,
      });

      const result = await this.employeeRepository.findAndCountAll({
        limit: parseInt(length, 10),
        offset: parseInt(start, 10),
        where: whereCondition,
        order: orderCondition,
        distinct: true,
      });

      const employees = result.rows.map((employee) => {
        const employeeData = new EmployeeDto(employee);
        return {
          ...employeeData,
        };
      });

      return {
        draw: parsedQuery.draw,
        data: employees,
        recordsTotal: recordsTotal,
        recordsFiltered: result.count,
      };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteEmployee(id: string) {
    try {
      const employee = await this.employeeRepository.findByPk(id);
      if (!employee) {
        throw this.errorMessageService.GeneralErrorCore(
          'Employee not found',
          404,
        );
      }

      await this.employeeSalaryRepository.destroy({
        where: { employee_id: id },
      });

      const deleted = await this.employeeRepository.destroy({
        where: { id: id },
      });

      if (deleted) {
        return { message: 'Employee deleted successfully' };
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to delete Employee',
          200,
        );
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
