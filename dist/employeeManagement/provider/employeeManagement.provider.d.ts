import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
import { Employee } from '../entity/employeeManagement.entity';
export declare const employeeProvider: ({
    provide: string;
    useValue: typeof Employee;
} | {
    provide: string;
    useValue: typeof EmployeeSalary;
})[];
