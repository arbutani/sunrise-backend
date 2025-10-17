/* eslint-disable prettier/prettier */

import { Country } from './../entity/country.entity';

export const CountryProvider = [
  {
    provide: 'COUNTRY_REPOSITORY',
    useValue: Country,
  },
];
