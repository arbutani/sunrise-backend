import { SubcategoriesDto } from 'src/subcategories/dto/subcategories.dto';
export declare class CategoriesDto {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    subcategories: SubcategoriesDto;
    constructor(data: any);
}
