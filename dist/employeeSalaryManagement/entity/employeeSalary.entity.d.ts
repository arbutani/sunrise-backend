import { Model } from 'sequelize-typescript';
import { Employee } from 'src/employeeManagement/entity/employeeManagement.entity';
export declare class EmployeeSalary extends Model<EmployeeSalary> {
    id: string;
    employee_id: string;
    employee: Employee;
    monthly_salary: number;
    working_days: number;
    working_hour: number;
    over_time: number;
    leave_day: number;
    total_attempts_day: number;
    total_payable_salary: number;
    reference_number: string;
    createdAt: Date;
    updatedAt: Date;
    reference_number_date: Date;
}
