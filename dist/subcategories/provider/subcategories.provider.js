"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcategoriesProvider = void 0;
const subcategories_entity_1 = require("../entity/subcategories.entity");
exports.SubcategoriesProvider = [
    {
        provide: 'SUBCATEGORIES_REPOSITORY',
        useValue: subcategories_entity_1.Subcategories,
    },
];
//# sourceMappingURL=subcategories.provider.js.map