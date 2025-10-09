/* eslint-disable prettier/prettier */

import moment from 'moment';

export class SubcategoriesDto {
  id: string;
  name: string;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  constructor(data: any) {
    data = data.dataValues ? data.dataValues : data;
    this.id = data.id;
    this.name = data.name;
    this.category_id = data.category_id;
    const createdAt = data.createdAt
      ? data.createdAt
      : data.created_at
        ? data.created_at
        : '';
    const updatedAt = data.updatedAt
      ? data.updatedAt
      : data.updated_at
        ? data.updated_at
        : '';
    const deletedAt = data.deletedAt
      ? data.deletedAt
      : data.deleted_at
        ? data.deleted_at
        : '';

    if (createdAt) {
      this.createdAt = moment(createdAt, 'YYYY-MM-DD HH:mm:ss').format(
        'DD-MM-YYYY hh:mm A',
      );
    }

    if (updatedAt) {
      this.updatedAt = moment(updatedAt, 'YYYY-MM-DD HH:mm:ss').format(
        'DD-MM-YYYY hh:mm A',
      );
    }

    if (deletedAt) {
      this.deletedAt = moment(deletedAt, 'YYYY-MM-DD HH:mm:ss').format(
        'DD-MM-YYYY hh:mm A',
      );
    }
  }
}
