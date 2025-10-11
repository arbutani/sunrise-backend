import { EmployeeSalaryDto } from 'src/employeeSalaryManagement/dto/employeeSalary.dto';
export declare class EmployeeDto {
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
    constructor(data: any);
}
