import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize';
import { Employee } from '../entity/employeeManagement.entity';
import { EmployeeRequestDto } from '../dto/employeeManagementRequest.dto';
import { EmployeeDto } from '../dto/employeeManagement.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployeeSalary } from 'src/employeeSalaryManagement/entity/employeeSalary.entity';
import { EmployeePutRequestDto } from '../dto/employeeManagementputRequest.dto';
export declare class EmployeeService {
    private readonly employeeSalaryRepository;
    private readonly employeeRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    private readonly jwtService;
    constructor(employeeSalaryRepository: typeof EmployeeSalary, employeeRepository: typeof Employee, sequelize: Sequelize, errorMessageService: ErrorMessageService, jwtService: JwtService);
    createEmployee(requestDto: EmployeeRequestDto): Promise<EmployeeDto>;
    login(email: string, password: string): Promise<{
        access_token: string;
        employee: EmployeeDto;
        type: string;
    }>;
    updateEmployee(id: string, requestDto: EmployeePutRequestDto): Promise<EmployeeDto>;
    getEmployee(id: string): Promise<EmployeeDto>;
    queryBuilder(requestDto: any): Promise<{
        query: string;
        count_query: string;
    }>;
    getAllEmployees(requestDto?: any): Promise<EmployeeDto[] | {
        recordsTotal: number;
        recordsFiltered: number;
        data: any[];
    }>;
    deleteEmployee(id: string): Promise<{
        message: string;
    }>;
}
