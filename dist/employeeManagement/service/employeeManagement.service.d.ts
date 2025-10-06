import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize-typescript';
import { Employee } from '../entity/employeeManagement.entity';
import { EmployeeRequestDto } from '../dto/employeeManagementRequest.dto';
import { EmployeeDto } from '../dto/employeeManagement.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
export declare class EmployeeService {
    private readonly employeeSalaryRepository;
    private readonly employeeRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    private readonly jwtService;
    constructor(employeeSalaryRepository: typeof EmployeeSalary, employeeRepository: typeof Employee, sequelize: Sequelize, errorMessageService: ErrorMessageService, jwtService: JwtService);
    createemployee(requestDto: EmployeeRequestDto): Promise<EmployeeDto>;
    login(email: string, password: string): Promise<{
        access_token: string;
        employee: EmployeeDto;
        employee_type: string;
    }>;
    updateEmployee(id: string, requestDto: EmployeeRequestDto): Promise<EmployeeDto>;
    getEmployee(id: string): Promise<EmployeeDto>;
    getAllEmployees(query: any): Promise<{
        draw: any;
        data: {
            id: string;
            employee_name: string;
            email_address: string;
            employee_type: any;
            reference_number: string;
            reference_number_date: string;
            createdAt: string;
            updatedAt: string;
        }[];
        recordsTotal: number;
        recordsFiltered: number;
    }>;
    deleteEmployee(id: string): Promise<{
        message: string;
    }>;
}
