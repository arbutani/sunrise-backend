/* eslint-disable prettier/prettier */

import moment from 'moment';


export class CountryDto {
  id: string;
  country_name: string;
  currency_code: string;
  conversion_rate: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;


  constructor(data: any) {
    data = data.dataValues ? data.dataValues : data;
    this.id = data.id;
    this.country_name = data.country_name;
    this.currency_code = data.currency_code;
    this.conversion_rate = data.conversion_rate
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
