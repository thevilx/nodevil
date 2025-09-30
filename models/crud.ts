import {
  FilterQuery,
  isValidObjectId,
  Model,
  PopulateOptions,
  SortOrder,
  UpdateQuery,
} from 'mongoose';
import { TranslationKeys } from '../config/i18n/translation_keys';
import { ForbiddenError, NotFoundError, UnExpectedError } from '../utils/errors';
import { i18n } from '../config/i18n/i18n';
import { applyLocalization } from '../utils/general';

export class Crud<T> {
  private model: Model<T>;
  private not_found_message: keyof TranslationKeys;

  constructor(model: any, not_found_message: keyof TranslationKeys) {
    this.model = model;
    this.not_found_message = not_found_message;
  }

  async create(
    data: Partial<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
    }
  ) {
    try {
      const message = await this.model.create(data);

      if (options?.populate) {
        await (message as any).populate(options.populate);
      }

      return message.toObject();
    } catch (error) {
      throw error;
    }
  }

  async paginate(
    options: {
      page: number,
      pageSize: number,
      filter?: FilterQuery<T>;
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      sortBy?:
      | string
      | { [key: string]: SortOrder | { $meta: any } }
      | [string, SortOrder][]
      | undefined
      | null;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      const filterQuery = options?.filter || {};
      const sortBy = options?.sortBy || { createdAt: -1 };

      const [totalDocuments, rawData] = await Promise.all([
        this.model.countDocuments(filterQuery),
        this.model
          .find(filterQuery)
          .sort(sortBy)
          .skip((options.page - 1) * options.pageSize)
          .limit(options.pageSize)
          .select(options?.selectFields || '')
          .populate(options?.populate || [])
          .lean(),
      ]);

      let data = rawData;
      if (options?.returnAsTranslated === true) {
        data = applyLocalization(data);
      }

      const totalPages = Math.ceil(totalDocuments / options.pageSize);

      return {
        currentPage: options.page,
        totalPages,
        totalDocuments: totalDocuments,
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }
  async tryFindById(
    id: string,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      if (!isValidObjectId(id)) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      const query = this.model
        .findById(id)
        .populate(options?.populate || [])
        .select(options?.selectFields || '');

      let data = await query.lean();

      if (options?.returnAsTranslated === true) {
        data = applyLocalization(data);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: string,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      const data = await this.tryFindById(id, options);

      if (!data) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    filter: FilterQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      sortBy?:
      | string
      | { [key: string]: SortOrder | { $meta: any } }
      | [string, SortOrder][]
      | undefined
      | null;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      let data = await this.model
        .find(filter)
        .populate(options?.populate || [])
        .select(options?.selectFields || '')
        .sort(options?.sortBy || undefined)
        .lean();

      if (options?.returnAsTranslated === true) {
        data = applyLocalization(data);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async tryFindOne(
    filter: FilterQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      let data = await this.model
        .findOne(filter)
        .populate(options?.populate || [])
        .select(options?.selectFields || '')
        .lean();

      if (options?.returnAsTranslated === true) {
        data = applyLocalization(data);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      const data = await this.tryFindOne(filter, options);

      if (!data) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async tryUpdateById(
    id: string,
    updateData: UpdateQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      upsert?: boolean;
      returnAsTranslated?: boolean;
    }
  ) {
    if (!isValidObjectId(id)) {
      throw new NotFoundError(i18n.t(this.not_found_message));
    }

    let data = await this.model
      .findByIdAndUpdate(id, updateData, {
        new: true,
        upsert: options?.upsert || false,
        runValidators: true, // Default to true
        setDefaultsOnInsert: options?.upsert || false,
      })
      .populate(options?.populate || [])
      .select(options?.selectFields || '')
      .lean();

    if (options?.returnAsTranslated === true) {
      data = applyLocalization(data);
    }

    return data;
  }

  async updateById(
    id: string,
    updateData: UpdateQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      upsert?: boolean;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      if (!isValidObjectId(id)) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      let data = await this.tryUpdateById(id, updateData, options);

      if (options?.returnAsTranslated === true) {
        data = applyLocalization(data);
      }

      if (!data) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async tryUpdateOne(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      upsert?: boolean;
      returnAsTranslated?: boolean;
    }
  ) {
    let data = await this.model
      .findOneAndUpdate(filter, updateData, {
        new: true,
        upsert: options?.upsert || false,
        runValidators: true, // Default to true
        setDefaultsOnInsert: options?.upsert || false,
      })
      .populate(options?.populate || [])
      .select(options?.selectFields || '')
      .lean();

    if (options?.returnAsTranslated === true) {
      data = applyLocalization(data);
    }

    return data;
  }

  async updateOne(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      upsert?: boolean;
      returnAsTranslated?: boolean;
    }
  ) {
    try {
      const data = await this.tryUpdateOne(filter, updateData, options);

      if (!data) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>) {
    return await this.model.updateMany(filter, data);
  }

  async createOrUpdateIfExist(
    filter: FilterQuery<T>,
    data: Partial<T>, // Or UpdateQuery<T>
    options?: {
      populate?: PopulateOptions | (PopulateOptions | string)[];
      selectFields?: string | string[] | Record<string, number | boolean | string | object>;
      returnAsTranslated?: boolean;
    }
  ) {
    return await this.updateOne(filter, data, {
      ...options,
      upsert: true,
    });
  }

  async tryDeleteById(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundError(i18n.t(this.not_found_message));
    }

    const message = await this.model.findByIdAndDelete(id);

    return message;
  }

  async deleteById(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      const message = await this.tryDeleteById(id);

      if (!message) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  async tryDeleteOne(filter: FilterQuery<T>) {
    return await this.model.findOneAndDelete(filter);
  }

  async deleteOne(filter: FilterQuery<T>) {
    try {
      const message = await this.tryDeleteOne(filter);

      if (!message) {
        throw new NotFoundError(i18n.t(this.not_found_message));
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(filter: FilterQuery<T>) {
    return await this.model.deleteMany(filter);
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.exists(filter);
    return !!doc;
  }

  async getCount(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async assertUserOwnsResource(id: string, user_id: string, model_user_key: string = 'user') {
    const data: any = await this.findById(id);

    if (!data[model_user_key]) {
      throw new UnExpectedError(
        'field does not exist in model for asserting user owens a resource'
      );
    }

    if (user_id.toString() !== data[model_user_key].toString()) {
      throw new ForbiddenError(i18n.t('errors.unauthorized-access'));
    }
  }
}
