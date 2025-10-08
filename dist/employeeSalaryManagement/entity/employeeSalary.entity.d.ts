import { Model } from 'sequelize-typescript';
import { Employee } from 'src/employeeManagement/entity/employeeManagement.entity';
export declare class EmployeeSalary extends Model<EmployeeSalary> {
    id: string;
    employee_id: string;
    employee: Employee;
    monthly_salary: number;
    working_days: number;
    working_hour: number;
    createdAt: Date;
    updatedAt: Date;
}
