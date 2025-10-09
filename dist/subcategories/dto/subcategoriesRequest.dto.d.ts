import { CategoriesDto } from 'src/categories/dto/categories.dto';
export declare class SubcategoriesRequestDto {
    category_id: string;
    name: string;
    categories?: CategoriesDto[];
}
