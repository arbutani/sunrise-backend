import moment from 'moment';
import { Employee } from '../../employeeManagement/entity/employeeManagement.entity';

export class EmployeeSalaryDto {
  id: string;
  employee_id: string;
  monthly_salary: number;
  working_days: number;
  working_hour: number;
  createdAt: string;
  updatedAt: string;
  name?: string;

  constructor(data: any) {
    if (data) {
      data = data.dataValues ? data.dataValues : data;

      this.id = data.id;
      this.employee_id = data.employee_id;
      this.monthly_salary = data.monthly_salary;
      this.working_days = data.working_days;
      this.working_hour = data.working_hour;

      const createdAt = data.createdAt ?? data.created_at ?? '';
      const updatedAt = data.updatedAt ?? data.updated_at ?? '';

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

      if (data.Employee) {
        this.name = data.Employee.name;
      }
    }
  }
}
