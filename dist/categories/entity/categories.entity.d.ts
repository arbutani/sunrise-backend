import { Model } from 'sequelize-typescript';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';
export declare class Categories extends Model<Categories> {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    subcategories: Subcategories[];
}
