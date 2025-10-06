/* eslint-disable prettier/prettier */

import { DatabaseModule } from './database/module/database.module';
import { EmployeeModule } from './employeeManagement/module/employeeManagement.module';
import { SharedModule } from './shared/module/shared.module';

export const moduleList = [SharedModule, EmployeeModule, DatabaseModule];
