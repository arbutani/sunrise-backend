import { EmployeeType } from 'src/enum/employeeManagement/employeeType.enum';
export declare class EmployeePutRequestDto {
    name: string;
    email_address: string;
    password?: string;
    type: EmployeeType;
}
