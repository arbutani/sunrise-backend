import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { EmployeeSalaryService } from '../service/employeeSalary.services';
import { EmployeeSalaryRequestDto } from '../dto/employeeSalaryRequest.dto';
export declare class EmployeeSalaryController {
    private readonly employeeSalaryService;
    private readonly errorMessageService;
    constructor(employeeSalaryService: EmployeeSalaryService, errorMessageService: ErrorMessageService);
    createEmployeeSalary(requestDto: EmployeeSalaryRequestDto): Promise<SuccessResponseDto>;
    updateEmployeeSalary(employee_id: string, requestDto: Partial<EmployeeSalaryRequestDto>): Promise<SuccessResponseDto>;
    getEmployeeSalary(employee_id: string): Promise<SuccessResponseDto>;
    deleteEmployeeSalary(id: string): Promise<SuccessResponseDto>;
    getAllEmployeeSalaries(): Promise<SuccessResponseDto>;
}
