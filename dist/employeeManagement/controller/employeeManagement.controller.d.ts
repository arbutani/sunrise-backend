import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { EmployeeRequestDto } from '../dto/employeeManagementRequest.dto';
import { EmployeeService } from '../service/employeeManagement.service';
export declare class EmployeeController {
    private readonly employeeService;
    private readonly errorMessageService;
    constructor(employeeService: EmployeeService, errorMessageService: ErrorMessageService);
    createEmployee(requestDto: EmployeeRequestDto): Promise<SuccessResponseDto>;
    login(body: {
        email: string;
        password: string;
    }): Promise<SuccessResponseDto>;
    updateEmployee(id: string, requestDto: EmployeeRequestDto): Promise<SuccessResponseDto>;
    getEmployee(id: string): Promise<SuccessResponseDto>;
    getAllEmployees(query: any): Promise<any>;
    deleteEmployee(id: string): Promise<SuccessResponseDto>;
}
