/* eslint-disable prettier/prettier */
import { Categories } from 'src/categories/entity/categories.entity';
import { Employee } from 'src/employeeManagement/entity/employeeManagement.entity';
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';

export const TableList = [Employee, EmployeeSalary, Categories, Subcategories];
