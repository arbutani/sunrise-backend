import { EmployeeSalaryRequestDto } from 'src/employeeSalaryManagement/dto/employeeSalaryRequest.dto';
import { EmployeeType } from 'src/shared/enum/employeeManagement/employeeType.enum';
export declare class EmployeeRequestDto {
    name: string;
    email_address: string;
    password: string;
    type: EmployeeType;
    salary?: EmployeeSalaryRequestDto;
}
