/* eslint-disable prettier/prettier */

import { Categories } from '../entity/categories.entity';

export const CategoriesProvider = [
  {
    provide: 'CATEGORIES_REPOSITORY',
    useValue: Categories,
  },
];
