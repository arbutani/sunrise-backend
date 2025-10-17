"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryProvider = void 0;
const country_entity_1 = require("./../entity/country.entity");
exports.CountryProvider = [
    {
        provide: 'COUNTRY_REPOSITORY',
        useValue: country_entity_1.Country,
    },
];
//# sourceMappingURL=country.provider.js.map