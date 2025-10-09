import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { CategoriesService } from '../service/categories.service';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    private readonly errorMessageService;
    constructor(categoriesService: CategoriesService, errorMessageService: ErrorMessageService);
    createCategory(requestDto: CategoriesRequestDto): Promise<SuccessResponseDto>;
    updateCategory(id: string, requestDto: CategoriesRequestDto): Promise<SuccessResponseDto>;
    getCategory(id: string): Promise<SuccessResponseDto>;
    getAllCategories(query: any): Promise<any>;
    deleteCategory(id: string): Promise<SuccessResponseDto>;
}
