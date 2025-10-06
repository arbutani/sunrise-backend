/* eslint-disable prettier/prettier */
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
import { Employee } from '../entity/employeeManagement.entity';

export const employeeProvider = [
  {
    provide: 'EMPLOYEE_REPOSITORY',
    useValue: Employee,
  },
  {
    provide: 'EMPLOYEE_SALARY_REPOSITORY',
    useValue: EmployeeSalary,
  },
];
