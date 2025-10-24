import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { ProductsService } from '../service/products.service';
import { ProductsRequestDto } from '../dto/productsRequest.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly errorMessageService;
    constructor(productsService: ProductsService, errorMessageService: ErrorMessageService);
    createProduct(requestDto: ProductsRequestDto, photo?: Express.Multer.File): Promise<SuccessResponseDto>;
    updateProduct(id: string, requestDto: ProductsRequestDto, photo?: Express.Multer.File): Promise<SuccessResponseDto>;
    getProduct(id: string): Promise<SuccessResponseDto>;
    getAllProducts(query: any): Promise<any>;
    deleteProduct(id: string): Promise<SuccessResponseDto>;
}
