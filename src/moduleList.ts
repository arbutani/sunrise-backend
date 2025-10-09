/* eslint-disable prettier/prettier */

import { CategoriesModule } from './categories/module/categories.module';
import { DatabaseModule } from './database/module/database.module';
import { EmployeeModule } from './employeeManagement/module/employeeManagement.module';
import { SharedModule } from './shared/module/shared.module';
import { SubcategoriesModule } from './subcategories/module/subcategories.module';

export const moduleList = [
  SharedModule,
  EmployeeModule,
  DatabaseModule,
  CategoriesModule,
  SubcategoriesModule,
];
