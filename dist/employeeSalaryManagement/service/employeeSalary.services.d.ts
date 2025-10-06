import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize-typescript';
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
    get(employee_id: string): Promise<EmployeeSalaryDto>;
    deleteEmployee(id: string): Promise<{
        message: string;
    }>;
    getAllEmployees(): Promise<EmployeeSalaryDto[]>;
}
