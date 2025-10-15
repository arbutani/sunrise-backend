/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Subcategories } from '../entity/subcategories.entity';
import { Categories } from 'src/categories/entity/categories.entity';
import { SubcategoriesRequestDto } from '../dto/subcategoriesRequest.dto';
import { SubcategoriesDto } from '../dto/subcategories.dto';

@Injectable()
export class SubcategoriesService {
  constructor(
    @Inject('SUBCATEGORIES_REPOSITORY')
    private readonly subcategoriesRepository: typeof Subcategories,
    @Inject('CATEGORIES_REPOSITORY')
    private readonly categoriesRepository: typeof Categories,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async create(requestDto: SubcategoriesRequestDto): Promise<SubcategoriesDto> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const findCategory = await this.categoriesRepository.findOne({
        where: {
          id: requestDto.category_id,
          deletedAt: { [Op.is]: null } as any,
        },
        transaction,
      });

      if (!findCategory) {
        throw new NotFoundException('Category not found or is deleted.');
      }

      const existingSubcategory = await this.subcategoriesRepository.findOne({
        where: {
          name: requestDto.name,
          category_id: requestDto.category_id,
          deletedAt: { [Op.is]: null } as any,
        },
        transaction,
      });

      if (existingSubcategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Subcategory with this name already exists in the specified category',
          200,
        );
      }

      const fields = {
        category_id: requestDto.category_id,
        name: requestDto.name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        deletedAt: null,
      } as any;

      const subcategory = await this.subcategoriesRepository.create(fields, {
        transaction,
      });

      await transaction.commit();
      status = true;
      
      return new SubcategoriesDto(subcategory);

    } catch (error) {
      if (status === false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async update(id: string, requestDto: Partial<SubcategoriesRequestDto>): Promise<SubcategoriesDto> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const existingSubcategory = await this.subcategoriesRepository.findOne({
        where: { id: id, deletedAt: { [Op.is]: null } as any },
        transaction,
      });

      if (!existingSubcategory) {
        throw new NotFoundException('Subcategory not found or is deleted');
      }

      const categoryIdToCheck = requestDto.category_id || existingSubcategory.category_id;
      const nameToCheck = requestDto.name || existingSubcategory.name;

      if (requestDto.category_id && requestDto.category_id !== existingSubcategory.category_id) {
        const newCategory = await this.categoriesRepository.findOne({
          where: {
            id: requestDto.category_id,
            deletedAt: { [Op.is]: null } as any,
          },
          transaction,
        });
        if (!newCategory) {
          throw new NotFoundException('New category not found or is deleted');
        }
      }

      if (requestDto.name || requestDto.category_id) {
        const duplicateSubcategory = await this.subcategoriesRepository.findOne({
          where: {
            name: nameToCheck,
            category_id: categoryIdToCheck,
            id: { [Op.ne]: id },
            deletedAt: { [Op.is]: null } as any,
          },
          transaction,
        });

        if (duplicateSubcategory) {
          throw this.errorMessageService.GeneralErrorCore(
            'Subcategory with this name already exists in the specified category',
            200,
          );
        }
      }

      const updateFields = {
        ...requestDto,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const [updateCount] = await this.subcategoriesRepository.update(updateFields, {
        where: { id: id, deletedAt: { [Op.is]: null } as any },
        transaction,
      });

      if (updateCount === 0) {
        throw new NotFoundException('Subcategory not found or update failed');
      }

      await transaction.commit();
      status = true;

      const updatedSubcategory = await this.subcategoriesRepository.findOne({
        where: { id: id, deletedAt: { [Op.is]: null } as any },
        include: [
          {
            model: Categories,
            attributes: ['id', 'name'],
          },
        ],
      });
      
      if (updatedSubcategory) {
        return new SubcategoriesDto(updatedSubcategory);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to retrieve updated subcategory',
          500,
        );
      }

    } catch (error) {
      if (status === false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async get(id: string, type: string = 'category_id'): Promise<SubcategoriesDto | SubcategoriesDto[]> {
    try {
      if (type === 'id') {
        const subcategory = await this.subcategoriesRepository.findOne({
          where: { id: id, deletedAt: { [Op.is]: null } as any },
          include: [
            {
              model: Categories,
              attributes: ['id', 'name'],
              required: false,
              where: { deletedAt: { [Op.is]: null } as any },
            },
          ],
        });

        if (!subcategory) {
          throw new NotFoundException('Subcategory not found or is deleted');
        }
        return new SubcategoriesDto(subcategory);
      } else {
        const subcategories = await this.subcategoriesRepository.findAll({
          where: {
            category_id: id,
            deletedAt: { [Op.is]: null } as any,
          },
          include: [
            {
              model: Categories,
              attributes: ['id', 'name'],
              required: false,
              where: { deletedAt: { [Op.is]: null } as any },
            },
          ],
          order: [['createdAt', 'DESC']],
        });

        if (!subcategories || subcategories.length === 0) {
          throw new NotFoundException('Subcategories not found for the given category');
        }
        return subcategories.map(
          (subcategory) => new SubcategoriesDto(subcategory),
        );
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllSubcategories(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0 && requestDto.columns) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count] = await this.sequelize.query(count_query, { raw: true });
        const countRows = count as any;

        const [results] = await this.sequelize.query(query, {
          raw: true,
        });

        const listData = await Promise.all(
          (results as any[]).map(async (subcategory: any) => {
            if (subcategory['created_at']) {
              subcategory['createdAt'] = moment(
                subcategory['created_at'],
              ).format('DD-MM-YYYY HH:mm A');
            }
            if (subcategory['updated_at']) {
              subcategory['updatedAt'] = moment(
                subcategory['updated_at'],
              ).format('DD-MM-YYYY HH:mm A');
            }

            if (subcategory.category_id) {
              const category = await this.categoriesRepository.findOne({
                where: { id: subcategory.category_id, deletedAt: { [Op.is]: null } as any },
                attributes: ['id', 'name'],
              });
              subcategory.category = category ? category.get({ plain: true }) : null;
            }

            return new SubcategoriesDto(subcategory);
          }),
        );

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
        const subcategories = await this.subcategoriesRepository.findAll({
          where: { deletedAt: { [Op.is]: null } as any },
          include: [
            {
              model: Categories,
              attributes: ['id', 'name'],
              required: false,
              where: { deletedAt: { [Op.is]: null } as any },
            },
          ],
          order: [['createdAt', 'DESC']],
        });

        if (!subcategories || subcategories.length === 0) {
          throw new NotFoundException('No subcategories found');
        }
        return subcategories.map(
          (subcategory) => new SubcategoriesDto(subcategory),
        );
      }
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
      const columns = ['id', 'category_id', 'name', 'created_at', 'updated_at'];
      
      let where = 'deleted_at IS NULL';

      if (requestDto.category_id && requestDto.category_id != '') {
        where += ` AND category_id='${requestDto.category_id}' `;
      }

      if (requestDto.name && requestDto.name != '') {
        where += ` AND name ILIKE '%${requestDto.name}%' `;
      }

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
            where += ` AND (${searchConditions.join(' OR ')}) `;
          }
        }
      }

      if (requestDto.id != null && requestDto.id != '') {
        where += ` AND id='${requestDto.id}' `;
      }
      
      let query = `SELECT subcategories.* FROM subcategories 
                  JOIN categories ON subcategories.category_id = categories.id`;
      let countQuery = `SELECT COUNT(subcategories.id) as count FROM subcategories 
                        JOIN categories ON subcategories.category_id = categories.id`;

      where += ` AND categories.deleted_at IS NULL`;

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
        orderBy = 'subcategories.created_at DESC';
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

  async deleteSubcategory(id: string): Promise<{ message: string }> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
      
      const [updatedRows] = await this.subcategoriesRepository.update(
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
        throw new NotFoundException('Subcategory not found or already deleted');
      }

      await transaction.commit();
      status = true;

      return { message: 'Subcategory deleted successfully' };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}