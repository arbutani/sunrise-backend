import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize';
import { Categories } from '../entity/categories.entity';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { CategoriesDto } from '../dto/categories.dto';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';
export declare class CategoriesService {
    private readonly categoriesRepository;
    private readonly subcategoriesRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    constructor(categoriesRepository: typeof Categories, subcategoriesRepository: typeof Subcategories, sequelize: Sequelize, errorMessageService: ErrorMessageService);
    createCategory(requestDto: CategoriesRequestDto): Promise<CategoriesDto>;
    getCategory(id: string): Promise<CategoriesDto>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
    queryBuilder(requestDto: any): Promise<{
        query: string;
        count_query: string;
    }>;
    getAllCategories(requestDto?: any): Promise<CategoriesDto[] | {
        recordsTotal: number;
        recordsFiltered: number;
        data: any[];
    }>;
    updateCategory(id: string, requestDto: CategoriesRequestDto): Promise<CategoriesDto>;
}
