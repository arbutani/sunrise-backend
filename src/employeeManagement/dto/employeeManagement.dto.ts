/* eslint-disable prettier/prettier */

import moment from 'moment';
import { EmployeeSalaryDto } from 'src/employeeSalaryManagement/dto/employeeSalary.dto';

export class EmployeeDto {
  id: string;
  name: string;
  email_address: string;
  type: any;
  reference_number: string;
  reference_date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  salary?: EmployeeSalaryDto;

  constructor(data: any) {
    data = data.dataValues ? data.dataValues : data;

    this.id = data.id;
    this.reference_number = data.reference_number;
    this.reference_date = data.reference_date;
    this.name = data.name;
    this.email_address = data.email_address;
    this.type = data.type;

    const createdAt = data.createdAt
      ? data.createdAt
      : data.created_at
        ? data.created_at
        : '';
    const updatedAt = data.updatedAt
      ? data.updatedAt
      : data.updated_at
        ? data.updated_at
        : '';
    const deletedAt = data.deletedAt
      ? data.deletedAt
      : data.deleted_at
        ? data.deleted_at
        : '';

    if (createdAt) {
      this.createdAt = moment(createdAt, 'YYYY-MM-DD HH:mm:ss').format(
        'DD-MM-YYYY hh:mm A',
      );
    }

    if (updatedAt) {
      this.updatedAt = moment(updatedAt, 'YYYY-MM-DD HH:mm:ss').format(
        'DD-MM-YYYY hh:mm A',
      );
    }

    if (deletedAt) {
      this.deletedAt = moment(deletedAt, 'YYYY-MM-DD HH:mm:ss').format(
        'DD-MM-YYYY hh:mm A',
      );
    }

    if (data.salary) {
      this.salary = new EmployeeSalaryDto(data.salary);
    }
  }
}
