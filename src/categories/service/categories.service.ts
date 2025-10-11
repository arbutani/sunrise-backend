/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Categories } from '../entity/categories.entity';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { CategoriesDto } from '../dto/categories.dto';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';

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

  async createCategory(requestDto: CategoriesRequestDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: requestDto.name },
        transaction: transaction,
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

      const category = await this.categoriesRepository.create(categoryFields, {
        transaction,
      });

      await transaction.commit();
      status = true;

      const newCategory = await this.categoriesRepository.findByPk(category.id);

      if (!newCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch created category',
          500,
        );
      }

      return new CategoriesDto(newCategory);
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async updateCategory(id: string, requestDto: CategoriesRequestDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const oldCategory = await this.categoriesRepository.findByPk(id, {
        transaction: transaction,
      });
      if (!oldCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category not found',
          404,
        );
      }

      if (requestDto.name !== oldCategory.name) {
        const findCategory = await this.categoriesRepository.findOne({
          where: {
            name: requestDto.name,
            id: { [Op.ne]: id },
          },
          transaction: transaction,
        });

        if (findCategory) {
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

      const [updatedCount] = await this.categoriesRepository.update(
        categoryFields,
        { where: { id }, transaction },
      );

      if (updatedCount === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to update category',
          200,
        );
      }

      await transaction.commit();
      status = true;

      const updatedCategory = await this.categoriesRepository.findByPk(id);

      if (!updatedCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch updated category',
          500,
        );
      }

      return new CategoriesDto(updatedCategory);
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getCategory(id: string) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const category = await this.categoriesRepository.findByPk(id, {
        include: [
          {
            model: this.subcategoriesRepository,
            where: { deletedAt: null },
            required: false,
          },
        ],
        transaction: transaction,
      });

      if (!category) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category not found',
          404,
        );
      }

      await transaction.commit();
      status = true;

      return new CategoriesDto(category);
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
      const columns = ['id', 'name', 'createdAt'];

      let where = 'deleted_at IS NULL';

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          for (const column of requestDto.columns) {
            if (column.searchable != null && column.searchable == 'true') {
              if (where != '') {
                where += ` AND `;
              }
              where += ` ${columns[column.data]} ILIKE '%${search}%' `;
            }
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
        for (const order of requestDto.order) {
          if (orderBy != '') {
            orderBy += ',';
          }
          orderBy += `${order.column} ${order.dir}`;
        }
        const order = requestDto.order[0];
        orderBy = `${columns[order.column]} ${order.dir}`;
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
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      if (requestDto && Object.keys(requestDto).length > 0) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count] = await this.sequelize.query(count_query, {
          raw: true,
          transaction: transaction,
        });
        const countRows = count as any;

        const [results] = await this.sequelize.query(query, {
          raw: true,
          transaction: transaction,
        });

        const listData = await Promise.all(
          results.map(async (category: any) => {
            if (category['created_at']) {
              category['createdAt'] = moment(category['created_at']).format(
                'DD-MM-YYYY HH:mm A',
              );
            }
            if (category['updated_at']) {
              category['updatedAt'] = moment(category['updated_at']).format(
                'DD-MM-YYYY HH:mm A',
              );
            }
            return category;
          }),
        );

        await transaction.commit();
        status = true;

        return {
          recordsTotal: Number(
            countRows.length > 0 && countRows[0]['count'] != ''
              ? countRows[0]['count']
              : 0,
          ),
          recordsFiltered: listData.length,
          data: listData,
        };
      } else {
        const categories = await this.categoriesRepository.findAll({
          where: {
            deletedAt: { [Op.is]: null },
          } as any,
          include: [
            {
              model: this.subcategoriesRepository,
              where: { deletedAt: null },
              required: false,
            },
          ],
          transaction: transaction,
        });

        if (!categories || categories.length === 0) {
          throw this.errorMessageService.GeneralErrorCore(
            'No categories found',
            404,
          );
        }

        await transaction.commit();
        status = true;

        return categories.map((category) => new CategoriesDto(category));
      }
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteCategory(id: string) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const [updatedRows] = await this.categoriesRepository.update(
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
          'Category not found',
          404,
        );
      }

      await transaction.commit();
      status = true;

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}

/*
/* eslint-disable prettier/prettier 
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { literal, Op, Sequelize, Transaction } from 'sequelize';
import { Categories } from '../entity/categories.entity';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { CategoriesDto } from '../dto/categories.dto';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';

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

  private async runTransaction<T>(fn: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    try {
      const result = await fn(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback().catch(() => {});
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async createCategory(requestDto: CategoriesRequestDto) {
    return this.runTransaction(async (transaction) => {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: requestDto.name },
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

      const category = await this.categoriesRepository.create(categoryFields, { transaction });

      const newCategory = await this.categoriesRepository.findByPk(category.id, { transaction });
      if (!newCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch created category',
          500,
        );
      }

      return new CategoriesDto(newCategory);
    });
  }

  async updateCategory(id: string, requestDto: CategoriesRequestDto) {
    return this.runTransaction(async (transaction) => {
      const oldCategory = await this.categoriesRepository.findByPk(id, { transaction });
      if (!oldCategory) {
        throw this.errorMessageService.GeneralErrorCore('Category not found', 404);
      }

      if (requestDto.name !== oldCategory.name) {
        const findCategory = await this.categoriesRepository.findOne({
          where: { name: requestDto.name, id: { [Op.ne]: id } },
          transaction,
        });

        if (findCategory) {
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

      const [updatedCount] = await this.categoriesRepository.update(categoryFields, {
        where: { id },
        transaction,
      });

      if (updatedCount === 0) {
        throw this.errorMessageService.GeneralErrorCore('Failed to update category', 200);
      }

      const updatedCategory = await this.categoriesRepository.findByPk(id, { transaction });
      if (!updatedCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch updated category',
          500,
        );
      }

      return new CategoriesDto(updatedCategory);
    });
  }

  async deleteCategory(id: string) {
    return this.runTransaction(async (transaction) => {
      const [updatedRows] = await this.categoriesRepository.update(
        { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') } as any,
        { where: { id, deletedAt: { [Op.is]: null } }, transaction },
      );

      if (updatedRows === 0) {
        throw this.errorMessageService.GeneralErrorCore('Category not found', 404);
      }

      return { message: 'Category deleted successfully' };
    });
  }

  async getCategory(id: string) {
    try {
      const category = await this.categoriesRepository.findByPk(id, {
        include: [
          { model: this.subcategoriesRepository, where: { deletedAt: null }, required: false },
        ],
      });

      if (!category) {
        throw this.errorMessageService.GeneralErrorCore('Category not found', 404);
      }

      return new CategoriesDto(category);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    try {
      const columns = ['id', 'name', 'createdAt'];
      let where = 'deleted_at IS NULL';

      if (requestDto.search?.value) {
        const search = requestDto.search.value;
        if (search !== '') {
          for (const column of requestDto.columns) {
            if (column.searchable === 'true') {
              where += ` AND ${columns[column.data]} ILIKE '%${search}%' `;
            }
          }
        }
      }

      if (requestDto.name) {
        where += ` AND name ILIKE '%${requestDto.name}%' `;
      }

      let query = `SELECT * FROM categories WHERE ${where}`;
      let countQuery = `SELECT COUNT(*) FROM categories WHERE ${where}`;

      if (requestDto.order?.length > 0) {
        const order = requestDto.order[0];
        query += ` ORDER BY ${columns[order.column]} ${order.dir}`;
      } else {
        query += ` ORDER BY created_at DESC`;
      }

      if (requestDto.length !== undefined && requestDto.start !== undefined && requestDto.length !== -1) {
        query += ` LIMIT ${requestDto.length} OFFSET ${requestDto.start}`;
      } else {
        query += ` LIMIT 10 OFFSET 0`;
      }

      return { query, count_query: countQuery };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllCategories(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count] = await this.sequelize.query(count_query, { raw: true });
        const [results] = await this.sequelize.query(query, { raw: true });

        const listData = results.map((category: any) => {
          if (category['created_at']) {
            category['createdAt'] = moment(category['created_at']).format('DD-MM-YYYY HH:mm A');
          }
          if (category['updated_at']) {
            category['updatedAt'] = moment(category['updated_at']).format('DD-MM-YYYY HH:mm A');
          }
          return category;
        });

        return {
          recordsTotal: Number(count?.[0]?.count ?? 0),
          recordsFiltered: listData.length,
          data: listData,
        };
      } else {
        const categories = await this.categoriesRepository.findAll({
          where: { deletedAt: { [Op.is]: null } } as any,
          include: [
            { model: this.subcategoriesRepository, where: { deletedAt: null }, required: false },
          ],
        });

        if (!categories || categories.length === 0) {
          throw this.errorMessageService.GeneralErrorCore('No categories found', 404);
        }

        return categories.map((category) => new CategoriesDto(category));
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
*/
