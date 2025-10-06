"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleList = void 0;
const database_module_1 = require("./database/module/database.module");
const employeeManagement_module_1 = require("./employeeManagement/module/employeeManagement.module");
const shared_module_1 = require("./shared/module/shared.module");
exports.moduleList = [shared_module_1.SharedModule, employeeManagement_module_1.EmployeeModule, database_module_1.DatabaseModule];
//# sourceMappingURL=moduleList.js.map