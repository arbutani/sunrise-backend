import { Model } from 'sequelize-typescript';
export declare class Products extends Model<Products> {
    id: string;
    name: string;
    description?: string;
    selling_price: number;
    shipping_charge: number;
    mini_purchase: number;
    country_id: string;
    qty: number;
    reorder_qty: number;
    photo: string;
    reference_number: string;
    reference_number_date: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
