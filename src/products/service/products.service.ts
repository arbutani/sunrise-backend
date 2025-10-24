/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { literal, Op, Sequelize, Transaction } from 'sequelize';
import { Products } from '../entity/products.entity';
import { ProductsRequestDto } from '../dto/productsRequest.dto';
import { ProductsDto } from '../dto/products.dto';
import { ProductsRequestDto as ProductsPutRequestDto } from '../dto/productsRequest.dto'; 
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY') 
    private readonly productRepository: typeof Products, 
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  private validateProductPhoto(file: Express.Multer.File | null): void {
    if (!file) return;

    const allowedExtensions = [
      '.jpg', 
      '.jpeg', 
      '.png', 
      '.webp',
      '.gif', 
      '.svg',
      '.tif', 
      '.tiff', 
      '.bmp', 
    ];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw this.errorMessageService.GeneralErrorCore(
        `Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`,
        400,
      );
    }
  }

  async createProduct(
    requestDto: ProductsRequestDto, 
    productPhoto: Express.Multer.File | null,
  ): Promise<ProductsDto> {
    try {
      this.validateProductPhoto(productPhoto);
    } catch (e) {
      if (productPhoto?.filename) {
          const projectRoot = path.resolve();
          const filePath = path.join(projectRoot, 'upload/photo', productPhoto.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
      }
      throw e;
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    const photoFileName = productPhoto?.filename || '';

    try {
      const existingProduct = await this.productRepository.findOne({
        where: { name: requestDto.name }, 
        transaction: transaction,
      });
      if (existingProduct) {
        throw this.errorMessageService.GeneralErrorCore(
          'Product with this name already exists',
          200,
        );
      }
      
      const lastProduct = await this.productRepository.findOne({
        order: [['createdAt', 'DESC']],
      });
      let nextSeriesNumber = 1;
      if (lastProduct && lastProduct.reference_number) {
        const match = lastProduct.reference_number.match(/[a-zA-Z](\d+)/); 
        if (match && match[1]) {
          const lastSeriesNumber = parseInt(match[1], 10);
          if (!isNaN(lastSeriesNumber)) {
            nextSeriesNumber = lastSeriesNumber + 1;
          }
        }
      }
      const dateString = moment().format('DDMMYY');
      const newReferenceNumber = `P${nextSeriesNumber}-${dateString}`; 
      
      const productFields = {
        reference_number: newReferenceNumber,
        reference_number_date: moment().format('YYYY-MM-DD'), 
        name: requestDto.name,
        description: requestDto.description,
        selling_price: requestDto.selling_price,
        shipping_charge: requestDto.shipping_charge,
        mini_purchase: requestDto.mini_purchase,
        qty: requestDto.qty,
        country_id: requestDto.country_id,
        reorder_qty: requestDto.reorder_qty,
        photo: photoFileName,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        deletedAt: null,
      } as any;
      
      let product = await this.productRepository.create(productFields, {
        transaction,
      });

      if (product) {
        product = product.dataValues ? product.dataValues : product; 
        await transaction.commit();
        status = true;
        return new ProductsDto(product);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Unable to create product',
          500,
        );
      }
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
        
        if (photoFileName) {
          const projectRoot = path.resolve();
          const filePath = path.join(projectRoot, 'upload/photo', photoFileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

async updateProduct(
  id: string,
  requestDto: ProductsPutRequestDto,
  productPhoto: Express.Multer.File | null,
) {
  const UPLOAD_FOLDER = 'upload/photo';
  const projectRoot = path.resolve();
  const uploadDir = path.join(projectRoot, UPLOAD_FOLDER);
  
  try {
    this.validateProductPhoto(productPhoto);
  } catch (e) {
    if (productPhoto?.filename) {
      const filePath = path.join(uploadDir, productPhoto.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    throw e;
  }

  const transaction = await this.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  
  let status = false;
  const newPhotoFileName = productPhoto?.filename || '';
  let oldPhotoFileName = '';

  try {
    const oldProduct = await this.productRepository.findByPk(id, { 
      transaction,
      raw: true
    });
    
    if (!oldProduct) {
      if (newPhotoFileName) {
        const filePath = path.join(uploadDir, newPhotoFileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      throw this.errorMessageService.GeneralErrorCore('Product not found', 404);
    }

    oldPhotoFileName = oldProduct.photo || '';

    if (requestDto.name && requestDto.name !== oldProduct.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { 
          name: requestDto.name, 
          id: { [Op.ne]: id } 
        },
        transaction,
      });
      
      if (existingProduct) {
        if (newPhotoFileName) {
          const filePath = path.join(uploadDir, newPhotoFileName);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        throw this.errorMessageService.GeneralErrorCore('Product with this name already exists', 200);
      }
    }

    const updateFields: any = {
      name: requestDto.name,
      description: requestDto.description,
      selling_price: requestDto.selling_price,
      shipping_charge: requestDto.shipping_charge,
      mini_purchase: requestDto.mini_purchase,
      qty: requestDto.qty,
      country_id: requestDto.country_id,
      reorder_qty: requestDto.reorder_qty,
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    if (newPhotoFileName) {
      updateFields.photo = newPhotoFileName;
    }

    const [updateCount] = await this.productRepository.update(updateFields, {
      where: { id },
      transaction,
    });

    if (updateCount === 0) {
      throw this.errorMessageService.GeneralErrorCore('Failed to update product', 500);
    }

    await transaction.commit();
    status = true;

    if (newPhotoFileName && oldPhotoFileName && newPhotoFileName !== oldPhotoFileName) {
      const oldFilePath = path.join(uploadDir, oldPhotoFileName);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (deleteError) {
          console.error(`Failed to delete old photo: ${oldPhotoFileName}`, deleteError);
        }
      }
    }

    const updatedProduct = await this.productRepository.findByPk(id);
    return new ProductsDto(updatedProduct);

  } catch (error) {
    if (!status) {
      await transaction.rollback().catch(() => {});
      
      if (newPhotoFileName) {
        const filePath = path.join(uploadDir, newPhotoFileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    throw this.errorMessageService.CatchHandler(error);
  }
}


  async getProduct(id: string) {
    try {
      let product = await this.productRepository.findByPk(id);

      if (!product) {
        throw this.errorMessageService.GeneralErrorCore(
          'Product not found',
          404,
        );
      }
      
      product = product.dataValues ? product.dataValues : product;
      
      return new ProductsDto(product);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const columns = [
        'id',
        'reference_number',
        'name',
        'selling_price',
        'qty',
        'createdAt',
      ];

      let where = 'deleted_at IS NULL';

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          const searchableColumns = [
            'reference_number',
            'name',
            'selling_price',
          ];
          const searchConditions: string[] = [];
          for (const col of searchableColumns) {
             searchConditions.push(`"${col}" ILIKE '%${search}%'`);
          }
          if (searchConditions.length > 0) {
            where += ` AND (${searchConditions.join(' OR ')})`;
          }
        }
      }

      if (requestDto.name && requestDto.name != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` "name" ILIKE '%${requestDto.name}%' `;
      }
      
      if (requestDto.country_id && requestDto.country_id != '') {
         if (where != '') {
          where += ` AND `;
        }
        where += ` "country_id" = '${requestDto.country_id}' `;
      }

      let query = `SELECT * FROM products`; 
      let countQuery = `SELECT COUNT(*) FROM products`; 

      if (where != '') {
        query += ` WHERE ${where}`;
        countQuery += ` WHERE ${where}`;
      }

      let orderBy = '';
      if (requestDto.order && requestDto.order.length > 0) {
        const order = requestDto.order[0];
        const columnName = columns[order.column] || 'created_at'; 
        orderBy = `"${columnName}" ${order.dir}`;
      }

      if (orderBy == '') {
        orderBy = 'created_at DESC';
      }

      query += ` ORDER BY ${orderBy}`;

      if (requestDto.length && requestDto.start) {
        if (requestDto.length != -1) {
          query += ` LIMIT ${requestDto.length} OFFSET ${requestDto.start}`;
        }
      } else {
        query += ` LIMIT 10 OFFSET 0`;
      }

      await transaction.commit();
      status = true;

      return { query: query, count_query: countQuery };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllProducts(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count] = await this.sequelize.query(count_query, { raw: true });
        const countRows = count as any;

        const [results] = await this.sequelize.query(query, { raw: true });
        
        const listData = results.map((product: any) => {
          if (product['createdAt']) {
            product['createdAt'] = moment(product['createdAt']).format(
              'DD-MM-YYYY HH:mm A',
            );
          }
          if (product['updatedAt']) {
            product['updatedAt'] = moment(product['updatedAt']).format(
              'DD-MM-YYYY HH:mm A',
            );
          }
          if (product['reference_number_date']) {
            product['reference_number_date'] = moment(
              product['reference_number_date'],
            ).format('DD-MM-YYYY');
          }
          return product;
        });

        return {
          recordsTotal: Number(
            countRows.length > 0 && countRows[0]['count'] !== ''
              ? countRows[0]['count']
              : 0,
          ),
          recordsFiltered: listData.length,
          data: listData,
        };
      } else {
        const products = await this.productRepository.findAll({
          where: literal('deleted_at IS NULL') as any,
        });

        if (!products || products.length === 0) {
          throw this.errorMessageService.GeneralErrorCore(
            'No products found',
            404,
          );
        }

        return products.map((product) => new ProductsDto(product));
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteProduct(id: string) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    let productPhotoName = '';

    try {
      
      const productToDelete = await this.productRepository.findByPk(id, { transaction });
      
      if (!productToDelete) {
        throw this.errorMessageService.GeneralErrorCore('Product not found', 404);
      }
      
      productPhotoName = productToDelete.photo;

      const [updatedRows] = await this.productRepository.update(
        { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') } as any,
        {
          where: {
            id: id,
            deletedAt: { [Op.is]: null },
          } as any,
          transaction: transaction,
        },
      );

      if (updatedRows === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'Product not found or already deleted',
          404,
        );
      }
      
      
      if (productPhotoName) {
        const projectRoot = path.resolve();
        const productPicPath = path.join(
          projectRoot,
          'upload/photo',
          productPhotoName,
        );
        
        if (fs.existsSync(productPicPath)) {
          fs.unlinkSync(productPicPath);
        }
      }

      await transaction.commit();
      status = true;

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}