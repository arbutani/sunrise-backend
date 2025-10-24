/* eslint-disable prettier/prettier */

import moment from 'moment';


export class ProductsDto {
  id: string;
  name: string;
  description: string;
  selling_price: number;
  shipping_charge: number;
  mini_purchase: number;
  qty: number;
  country_id: string;
  reorder_qty: number;
  photo: string;
  reference_number: string;
  reference_number_date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;


  constructor(data: any) {
    data = data.dataValues ? data.dataValues : data;
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.selling_price = data.selling_price;
    this.shipping_charge = data.shipping_charge;
    this.mini_purchase = data.mini_purchase;
    this.qty = data.qty;
    this.country_id = data.country_id;
    this.reorder_qty = data.reorder_qty;
    this.photo = data.photo;
    this.reference_number = data.reference_number;
    this.reference_number_date = data.reference_number_date;
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
