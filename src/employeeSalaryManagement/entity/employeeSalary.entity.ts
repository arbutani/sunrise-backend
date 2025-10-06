/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Employee } from 'src/employeeManagement/entity/employeeManagement.entity';

@Table({
  tableName: 'employee_salary_management',
  timestamps: false,
})
export class EmployeeSalary extends Model<EmployeeSalary> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  employee_id: string;

  @BelongsTo(() => Employee)
  declare employee: Employee;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  monthly_salary: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  working_days: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  working_hour: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  over_time: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  leave_day: number;

  @Column({
    type: DataType.NUMBER,
  })
  total_attempts_day: number;

  @Column({
    type: DataType.NUMBER,
  })
  total_payable_salary: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reference_number: string;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  reference_number_date: Date;
}
