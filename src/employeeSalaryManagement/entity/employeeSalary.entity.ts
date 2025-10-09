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

  @BelongsTo(() => Employee)
  declare employee: Employee;
}
