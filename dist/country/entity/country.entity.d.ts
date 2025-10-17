import { Model } from 'sequelize-typescript';
export declare class Country extends Model<Country> {
    id: string;
    country_name: string;
    currency_code: string;
    conversion_rate: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
