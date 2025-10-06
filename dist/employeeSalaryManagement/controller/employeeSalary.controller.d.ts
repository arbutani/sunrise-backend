import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { EmployeeSalaryService } from '../service/employeeSalary.services';
import { EmployeeSalaryRequestDto } from '../dto/employeeSalaryRequest.dto';
export declare class EmployeeSalaryController {
    private readonly employeeSalaryService;
    private readonly errorMessageService;
    constructor(employeeSalaryService: EmployeeSalaryService, errorMessageService: ErrorMessageService);
    createEmployee(requestDto: EmployeeSalaryRequestDto): Promise<SuccessResponseDto>;
    updateEmployee(id: string, requestDto: Partial<EmployeeSalaryRequestDto>): Promise<SuccessResponseDto>;
    getEmployee(id: string): Promise<SuccessResponseDto>;
    deleteEmployee(id: string): Promise<SuccessResponseDto>;
    getAllEmployees(): Promise<any>;
}
