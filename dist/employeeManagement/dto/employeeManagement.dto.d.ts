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
    salary?: {
        monthly_salary: number;
        working_days: number;
        working_hour: number;
    };
    constructor(data: any);
}
