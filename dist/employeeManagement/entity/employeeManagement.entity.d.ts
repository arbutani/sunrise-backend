import { Model } from 'sequelize-typescript';
export declare class Employee extends Model<Employee> {
    id: string;
    reference_number: string;
    reference_number_date: Date;
    employee_name: string;
    email_address: string;
    password: string;
    employee_type: string;
    createdAt: Date;
    updatedAt: Date;
}
