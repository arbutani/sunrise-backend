"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleList = void 0;
const categories_module_1 = require("./categories/module/categories.module");
const database_module_1 = require("./database/module/database.module");
const employeeManagement_module_1 = require("./employeeManagement/module/employeeManagement.module");
const shared_module_1 = require("./shared/module/shared.module");
const subcategories_module_1 = require("./subcategories/module/subcategories.module");
exports.moduleList = [
    shared_module_1.SharedModule,
    employeeManagement_module_1.EmployeeModule,
    database_module_1.DatabaseModule,
    categories_module_1.CategoriesModule,
    subcategories_module_1.SubcategoriesModule,
];
//# sourceMappingURL=moduleList.js.map