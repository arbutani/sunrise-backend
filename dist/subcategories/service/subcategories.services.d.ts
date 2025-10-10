import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize';
import { Subcategories } from '../entity/subcategories.entity';
import { Categories } from 'src/categories/entity/categories.entity';
import { SubcategoriesRequestDto } from '../dto/subcategoriesRequest.dto';
import { SubcategoriesDto } from '../dto/subcategories.dto';
export declare class SubcategoriesService {
    private readonly subcategoriesRepository;
    private readonly categoriesRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    constructor(subcategoriesRepository: typeof Subcategories, categoriesRepository: typeof Categories, sequelize: Sequelize, errorMessageService: ErrorMessageService);
    create(requestDto: SubcategoriesRequestDto): Promise<SubcategoriesDto>;
    update(id: string, requestDto: Partial<SubcategoriesRequestDto>): Promise<SubcategoriesDto>;
    get(id: string, type?: string): Promise<any>;
    getAllSubcategories(requestDto?: any): Promise<SubcategoriesDto[] | {
        recordsTotal: number;
        recordsFiltered: number;
        data: SubcategoriesDto[];
    }>;
    queryBuilder(requestDto: any): Promise<{
        query: string;
        count_query: string;
    }>;
    deleteSubcategory(id: string): Promise<{
        message: string;
    }>;
}
