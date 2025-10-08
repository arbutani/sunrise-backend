import { Model } from 'sequelize-typescript';
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
export declare class Employee extends Model<Employee> {
    id: string;
    reference_number: string;
    reference_date: Date;
    name: string;
    email_address: string;
    password: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    salaries: EmployeeSalary[];
}
