/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Op, Sequelize, Transaction } from 'sequelize'; 
import { Categories } from '../entity/categories.entity';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { CategoriesDto } from '../dto/categories.dto';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';
import { SubcategoriesDto } from 'src/subcategories/dto/subcategories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORIES_REPOSITORY')
    private readonly categoriesRepository: typeof Categories,
    @Inject('SUBCATEGORIES_REPOSITORY')
    private readonly subcategoriesRepository: typeof Subcategories,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async createCategory(requestDto: CategoriesRequestDto): Promise<CategoriesDto> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: requestDto.name, deletedAt: { [Op.is]: null } as any },
        transaction,
      });

      if (existingCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category with this name already exists',
          200,
        );
      }

      const categoryFields = {
        name: requestDto.name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        deletedAt: null,
      } as any;

      let category = await this.categoriesRepository.create(categoryFields, {
        transaction,
      });

      category = category.dataValues ? category.dataValues : category;

      const subcategoriesList: Subcategories[] = [];

      if (
        requestDto.subcategories &&
        Array.isArray(requestDto.subcategories) &&
        requestDto.subcategories.length > 0
      ) {
        for (const sub of requestDto.subcategories) {
          const subcategoryData = {
            category_id: category.id,
            name: sub.name,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            deletedAt: null,
          } as any;

          const subcategory = await this.subcategoriesRepository.create(
            subcategoryData,
            { transaction },
          );
          subcategoriesList.push(subcategory);
        }
      }

      category['subcategories'] = subcategoriesList;

      await transaction.commit();
      status = true;

      return new CategoriesDto(category);
    } catch (error) {
      if (status === false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getCategory(id: string): Promise<CategoriesDto> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id: id, deletedAt: { [Op.is]: null } as any },
        include: [
          {
            model: Subcategories,
            required: false,
            where: { deletedAt: { [Op.is]: null } as any },
          },
        ],
        subQuery: false,
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const categoryPlain = category.get({ plain: true }) as any;

      let subcategory: SubcategoriesDto | null = null;
      if (categoryPlain.subcategories && categoryPlain.subcategories.length > 0) {
        subcategory = new SubcategoriesDto(categoryPlain.subcategories[0]);
      }

      const responseData = {
        ...categoryPlain,
        subcategories: subcategory,
      };

      return new CategoriesDto(responseData);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
      
      const [updatedRows] = await this.categoriesRepository.update(
        { deletedAt: deletedAt } as any,
        {
          where: {
            id: id,
            deletedAt: { [Op.is]: null },
          } as any,
          transaction: transaction,
        },
      );

      if (updatedRows === 0) {
        throw new NotFoundException('Category not found or already deleted');
      }

      await this.subcategoriesRepository.update(
        { deletedAt: deletedAt } as any,
        {
          where: {
            category_id: id,
            deletedAt: { [Op.is]: null },
          } as any,
          transaction: transaction,
        },
      );

      await transaction.commit();
      status = true;

      return { message: 'Category and related subcategories deleted successfully' };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const columns: any[] = [ 
        'id',
        'name',
        'created_at',
        'updated_at',
      ];

      let where = 'deleted_at IS NULL'; 

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          let searchConditions: string[] = []; 
          for (const column of requestDto.columns) {
            const columnIndex = Number(column.data);
            if (column.searchable != null && column.searchable == 'true' && columns[columnIndex]) {
              searchConditions.push(` ${columns[columnIndex] as string} ILIKE '%${search}%' `);
            }
          }
          if (searchConditions.length > 0) {
            if (where != '') {
              where += ` AND `;
            }
            where += ` (${searchConditions.join(' OR ')}) `;
          }
        }
      }

      if (requestDto.name && requestDto.name != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` name ILIKE '%${requestDto.name}%' `; 
      }
      
      let query = `SELECT * FROM categories`;
      let countQuery = `SELECT COUNT(*) FROM categories`;

      if (where != '') {
        query += ` WHERE ${where}`;
        countQuery += ` WHERE ${where}`;
      }

      let orderBy = '';
      if (requestDto.order && requestDto.order.length > 0) {
        const order = requestDto.order[0];
        const orderColumnIndex = Number(order.column);
        if(columns[orderColumnIndex]) {
          orderBy = `${columns[orderColumnIndex] as string} ${order.dir}`;
        }
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

  async getAllCategories(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0 && requestDto.columns) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count] = await this.sequelize.query(count_query, { raw: true });
        const countRows = count as any;

        const [results] = await this.sequelize.query(query, { raw: true });

        const listData = (results as any[]).map((category: any) => {
          if (category['created_at']) {
            category['created_at'] = moment(category['created_at']).format(
              'DD-MM-YYYY hh:mm A',
            );
          }
          if (category['updated_at']) {
            category['updated_at'] = moment(category['updated_at']).format(
              'DD-MM-YYYY hh:mm A',
            );
          }
          return category;
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
        const categories = await this.categoriesRepository.findAll({
          where: { deletedAt: { [Op.eq]: null } as any }, 
          include: [
            {
              model: Subcategories,
              required: false,
              where: { deletedAt: { [Op.is]: null } as any },
            },
          ],
          order: [['createdAt', 'DESC']],
        });

        if (!categories || categories.length === 0) {
          throw new NotFoundException('No categories found');
        }

        return categories.map((category) => {
          const categoryPlain = category.get({ plain: true }) as any;
          let subcategory: SubcategoriesDto | null = null;
          if (categoryPlain.subcategories && categoryPlain.subcategories.length > 0) {
            subcategory = new SubcategoriesDto(categoryPlain.subcategories[0]);
          }
          categoryPlain.subcategories = subcategory;
          return new CategoriesDto(categoryPlain);
        });
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async updateCategory(
  id: string,
  requestDto: CategoriesRequestDto,
): Promise<CategoriesDto> {
  const transaction = await this.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  let status = false;

  try {
    const oldCategory = await this.categoriesRepository.findOne({
      where: { id: id, deletedAt: { [Op.is]: null } as any },
      transaction,
    });

    if (!oldCategory) {
      throw new NotFoundException('Category not found');
    }

    const oldCategoryPlain = oldCategory.dataValues ? oldCategory.dataValues : oldCategory;

    if (requestDto.name && requestDto.name !== oldCategoryPlain.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: {
          name: requestDto.name,
          deletedAt: { [Op.is]: null } as any,
          id: { [Op.ne]: id },
        },
        transaction,
      });

      if (existingCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category with this name already exists',
          200,
        );
      }
    }

    const categoryFields = {
      name: requestDto.name,
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    } as any;

    const [updateCount] = await this.categoriesRepository.update(
      categoryFields,
      {
        where: { id },
        transaction,
      },
    );

    if (updateCount === 0) {
      throw this.errorMessageService.GeneralErrorCore(
        'Failed to update category',
        500,
      );
    }

    if (requestDto.subcategories && Array.isArray(requestDto.subcategories) && requestDto.subcategories.length > 0) {
      const existingSubcategories = await this.subcategoriesRepository.findAll({
        where: { 
          category_id: id, 
          deletedAt: { [Op.is]: null } as any 
        },
        transaction,
      });

      const existingSubcategoriesPlain = existingSubcategories.map(sub => 
        sub.dataValues ? sub.dataValues : sub
      );

      for (const sub of requestDto.subcategories) {
        const existingSub = existingSubcategoriesPlain.find(
          existing => existing.name === sub.name
        );

        if (!existingSub) {
          const subcategoryData = {
            category_id: id,
            name: sub.name,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            deletedAt: null,
          } as any;

          await this.subcategoriesRepository.create(
            subcategoryData,
            { transaction },
          );
        }
      }
    }

    await transaction.commit();
    status = true;

    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id: id, deletedAt: { [Op.is]: null } as any },
      include: [
        {
          model: Subcategories,
          required: false,
          where: { deletedAt: { [Op.is]: null } as any },
        },
      ],
    });

    if (!updatedCategory) {
      throw this.errorMessageService.GeneralErrorCore(
        'Failed to fetch updated category',
        500,
      );
    }

    let categoryPlain = updatedCategory.get({ plain: true }) as any;
    
    if (categoryPlain.subcategories && categoryPlain.subcategories.length > 0) {
      categoryPlain.subcategories = categoryPlain.subcategories.map(
        (sub: any) => new SubcategoriesDto(sub)
      );
    }

    return new CategoriesDto(categoryPlain);
  } catch (error) {
    if (status === false) {
      await transaction.rollback().catch(() => {});
    }
    throw this.errorMessageService.CatchHandler(error);
  }
}
}