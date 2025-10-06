/* eslint-disable prettier/prettier */
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { EmployeeType } from 'src/enum/employeeManagement/employeeType.enum';

@Table({
  tableName: 'employee_managment',
  timestamps: false,
})
export class Employee extends Model<Employee> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare reference_number: string;

  @Column({
    type: DataType.DATEONLY,
  })
  declare reference_number_date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare employee_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email_address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(
      EmployeeType.ADMIN,
      EmployeeType.STORE_MANAGER,
      EmployeeType.DELIVERY_DRIVER,
      EmployeeType.STORE_SUPERVISOR,
    ),
  })
  declare employee_type: string;

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
}
