import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { SubcategoriesService } from '../service/subcategories.services';
import { SubcategoriesRequestDto } from '../dto/subcategoriesRequest.dto';
export declare class SubcategoriesController {
    private readonly subcategoriesService;
    private readonly errorMessageService;
    constructor(subcategoriesService: SubcategoriesService, errorMessageService: ErrorMessageService);
    createSubcategory(requestDto: SubcategoriesRequestDto): Promise<SuccessResponseDto>;
    updateSubcategory(id: string, requestDto: Partial<SubcategoriesRequestDto>): Promise<SuccessResponseDto>;
    getSubcategory(id: string, type?: string): Promise<SuccessResponseDto>;
    getAllSubcategories(query: any): Promise<any>;
    deleteSubcategory(id: string): Promise<SuccessResponseDto>;
}
