import { Model } from 'sequelize-typescript';
import { Categories } from 'src/categories/entity/categories.entity';
export declare class Subcategories extends Model<Subcategories> {
    id: string;
    category_id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    categories: Categories;
}
