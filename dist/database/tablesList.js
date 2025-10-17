"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableList = void 0;
const categories_entity_1 = require("../categories/entity/categories.entity");
const country_entity_1 = require("../country/entity/country.entity");
const employeeManagement_entity_1 = require("../employeeManagement/entity/employeeManagement.entity");
const employeeSalary_entity_1 = require("../employeeSalaryManagement/entity/employeeSalary.entity");
const subcategories_entity_1 = require("../subcategories/entity/subcategories.entity");
exports.TableList = [employeeManagement_entity_1.Employee, employeeSalary_entity_1.EmployeeSalary, categories_entity_1.Categories, subcategories_entity_1.Subcategories, country_entity_1.Country];
//# sourceMappingURL=tablesList.js.map