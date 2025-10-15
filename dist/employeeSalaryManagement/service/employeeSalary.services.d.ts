import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize';
import { EmployeeSalary } from '../entity/employeeSalary.entity';
import { Employee } from 'src/employeeManagement/entity/employeeManagement.entity';
import { EmployeeSalaryRequestDto } from '../dto/employeeSalaryRequest.dto';
import { EmployeeSalaryDto } from '../dto/employeeSalary.dto';
export declare class EmployeeSalaryService {
    private readonly employeeSalaryRepository;
    private readonly employeeRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    constructor(employeeSalaryRepository: typeof EmployeeSalary, employeeRepository: typeof Employee, sequelize: Sequelize, errorMessageService: ErrorMessageService);
    create(requestDto: EmployeeSalaryRequestDto): Promise<EmployeeSalaryDto>;
    update(employee_id: string, requestDto: Partial<EmployeeSalaryRequestDto>): Promise<EmployeeSalaryDto>;
    get(id: string, type?: string): Promise<any>;
    deleteEmployeeSalary(id: string): Promise<{
        message: string;
    }>;
    getAllEmployeeSalaries(requestDto?: any): Promise<EmployeeSalaryDto[] | {
        recordsTotal: number;
        recordsFiltered: number;
        data: any[];
    }>;
    queryBuilder(requestDto: any): Promise<{
        query: string;
        count_query: string;
    }>;
}
