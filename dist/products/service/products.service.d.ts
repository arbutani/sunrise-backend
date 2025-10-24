import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize';
import { Products } from '../entity/products.entity';
import { ProductsRequestDto } from '../dto/productsRequest.dto';
import { ProductsDto } from '../dto/products.dto';
import { ProductsRequestDto as ProductsPutRequestDto } from '../dto/productsRequest.dto';
export declare class ProductsService {
    private readonly productRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    constructor(productRepository: typeof Products, sequelize: Sequelize, errorMessageService: ErrorMessageService);
    private validateProductPhoto;
    createProduct(requestDto: ProductsRequestDto, productPhoto: Express.Multer.File | null): Promise<ProductsDto>;
    updateProduct(id: string, requestDto: ProductsPutRequestDto, productPhoto: Express.Multer.File | null): Promise<ProductsDto>;
    getProduct(id: string): Promise<ProductsDto>;
    queryBuilder(requestDto: any): Promise<{
        query: string;
        count_query: string;
    }>;
    getAllProducts(requestDto?: any): Promise<ProductsDto[] | {
        recordsTotal: number;
        recordsFiltered: number;
        data: any[];
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
}
