/* eslint-disable prettier/prettier */
import moment from 'moment';

export class EmployeeSalaryDto {
  id: string;
  employee_id: string;
  monthly_salary: number;
  working_days: number;
  working_hour: number;
  over_time: number;
  leave_day: number;
  total_attempts_day: number;
  total_payable_salary: number;
  reference_number: string;
  reference_number_date: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: any) {
    if (data) {
      data = data.dataValues ? data.dataValues : data;

      this.id = data.id;
      this.employee_id = data.employee_id;
      this.monthly_salary = data.monthly_salary;
      this.working_days = data.working_days;
      this.working_hour = data.working_hour;
      this.over_time = data.over_time;
      this.leave_day = data.leave_day;
      this.total_attempts_day = data.total_attempts_day;
      this.total_payable_salary = data.total_payable_salary;
      this.reference_number = data.reference_number;
      this.reference_number_date = data.reference_number_date;

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
    }
  }
}
