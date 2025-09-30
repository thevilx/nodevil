// tests/unit/crud/BaseCrud.test.ts
import { Model, Types } from 'mongoose';
import { Crud } from '../../models/crud';
import { NotFoundError, ForbiddenError } from '../../utils/errors';
import { TestHelpers } from '../utils/testHelpers';
import mongoose from 'mongoose';
import { IUser } from '../../models/user/user';

// Mock model for testing
interface ITestModel {
  _id?: string;
  name: string;
  description?: string;
  user?: Types.ObjectId | IUser;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock Mongoose model
let TestModel: Model<ITestModel>;
let TestCrud: Crud<ITestModel>;

describe.skip('BaseCrud', () => {
  beforeAll(async () => {
    // Create a test schema and model
    const testSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        description: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        active: { type: Boolean, default: true },
      },
      { timestamps: true }
    );

    TestModel = mongoose.model<ITestModel>('TestModel', testSchema);
    TestCrud = new Crud<ITestModel>(TestModel, 'test-not-found');
  });

  describe('create', () => {
    it('should create a document successfully', async () => {
      // Arrange
      const testData: Partial<ITestModel> = {
        name: 'Test Document',
        description: 'Test Description',
      };

      // Act
      const created = await TestCrud.create(testData);

      // Assert
      expect(created).toBeDefined();
      expect(created._id).toBeDefined();
      expect(created.name).toBe(testData.name);
      expect(created.description).toBe(testData.description);
      expect(created.createdAt).toBeInstanceOf(Date);
    });

    it('should create a document with populate option', async () => {
      // Arrange
      const user = await TestHelpers.createTestCustomer();
      const testData: Partial<ITestModel> = {
        name: 'Test Document',
        user: user._id,
      };

      // Act
      const created = await TestCrud.create(testData, {
        populate: ['user'],
      });

      // Assert
      expect(created).toBeDefined();
      expect(created.user).toBeDefined();
      expect(typeof created.user).toBe('object');
    });
  });

  describe('paginate', () => {
    beforeEach(async () => {
      // Create test data
      for (let i = 1; i <= 15; i++) {
        await TestCrud.create({
          name: `Test Document ${i}`,
          active: i % 2 === 0,
        });
      }
    });

    it('should paginate documents correctly', async () => {
      // Act
      const result = await TestCrud.paginate({
        page: 1,
        pageSize: 5,
      });

      // Assert
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(3);
      expect(result.totalDocuments).toBe(15);
      expect(result.data).toHaveLength(5);
    });

    it('should paginate with filter', async () => {
      // Act
      const result = await TestCrud.paginate({
        page: 1,
        pageSize: 10,
        filter: { active: true },
      });

      // Assert
      expect(result.totalDocuments).toBe(7);
      expect(result.data).toHaveLength(7);
      expect(result.data.every(doc => doc.active === true)).toBe(true);
    });

    it('should paginate with custom sort', async () => {
      // Act
      const result = await TestCrud.paginate({
        page: 1,
        pageSize: 5,
        sortBy: { name: 1 },
      });

      // Assert
      expect(result.data[0].name).toBe('Test Document 1');
      expect(result.data[1].name).toBe('Test Document 10');
    });
  });

  describe('findById', () => {
    it('should find document by id', async () => {
      // Arrange
      const created = await TestCrud.create({ name: 'Test Document' });

      // Act
      const found = await TestCrud.findById(created._id!);

      // Assert
      expect(found).toBeDefined();
      expect(found._id.toString()).toBe(created._id.toString());
      expect(found.name).toBe(created.name);
    });

    it('should throw NotFoundError for non-existent id', async () => {
      // Act & Assert
      await expect(TestCrud.findById('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for invalid id', async () => {
      // Act & Assert
      await expect(TestCrud.findById('invalid-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('tryFindById', () => {
    it('should return null for non-existent id', async () => {
      // Act
      const result = await TestCrud.tryFindById('507f1f77bcf86cd799439011');

      // Assert
      expect(result).toBeNull();
    });

    it('should find document with populate and select options', async () => {
      // Arrange
      const user = await TestHelpers.createTestCustomer();
      const created = await TestCrud.create({
        name: 'Test Document',
        description: 'Test Description',
        user: user._id,
      });

      // Act
      const found = await TestCrud.tryFindById(created._id!, {
        populate: ['user'],
        selectFields: 'name user',
      });

      // Assert
      expect(found).toBeDefined();
      expect(found?.name).toBe(created.name);
      expect(found?.description).toBeUndefined();
      expect(found?.user).toBeDefined();
    });
  });

  describe('findMany', () => {
    beforeEach(async () => {
      await TestCrud.create({ name: 'Document 1', active: true });
      await TestCrud.create({ name: 'Document 2', active: false });
      await TestCrud.create({ name: 'Document 3', active: true });
    });

    it('should find multiple documents with filter', async () => {
      // Act
      const results = await TestCrud.findMany({ active: true });

      // Assert
      expect(results).toHaveLength(2);
      expect(results.every(doc => doc.active === true)).toBe(true);
    });

    it('should find documents with sort option', async () => {
      // Act
      const results = await TestCrud.findMany(
        {},
        {
          sortBy: { name: -1 },
        }
      );

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0].name).toBe('Document 3');
      expect(results[2].name).toBe('Document 1');
    });
  });

  describe('findOne', () => {
    it('should find one document matching filter', async () => {
      // Arrange
      await TestCrud.create({ name: 'Document 1', active: true });
      await TestCrud.create({ name: 'Document 2', active: false });

      // Act
      const found = await TestCrud.findOne({ active: false });

      // Assert
      expect(found).toBeDefined();
      expect(found.name).toBe('Document 2');
    });

    it('should throw NotFoundError when no document matches', async () => {
      // Act & Assert
      await expect(TestCrud.findOne({ name: 'Non-existent' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('tryFindOne', () => {
    it('should return null when no document matches', async () => {
      // Act
      const result = await TestCrud.tryFindOne({ name: 'Non-existent' });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateById', () => {
    it('should update document by id', async () => {
      // Arrange
      const created = await TestCrud.create({ name: 'Original Name' });

      // Act
      const updated = await TestCrud.updateById(created._id!, {
        name: 'Updated Name',
      });

      // Assert
      expect(updated).toBeDefined();
      expect(updated.name).toBe('Updated Name');
    });

    it('should throw NotFoundError for non-existent id', async () => {
      // Act & Assert
      await expect(
        TestCrud.updateById('507f1f77bcf86cd799439011', {
          name: 'Updated',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('tryUpdateById', () => {
    it('should return null for non-existent id', async () => {
      // Act
      const result = await TestCrud.tryUpdateById('507f1f77bcf86cd799439011', {
        name: 'Updated',
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateOne', () => {
    it('should update one document matching filter', async () => {
      // Arrange
      await TestCrud.create({ name: 'Document 1', active: true });
      await TestCrud.create({ name: 'Document 2', active: true });

      // Act
      const updated = await TestCrud.updateOne({ name: 'Document 1' }, { active: false });

      // Assert
      expect(updated).toBeDefined();
      expect(updated.name).toBe('Document 1');
      expect(updated.active).toBe(false);
    });

    it('should throw NotFoundError when no document matches', async () => {
      // Act & Assert
      await expect(TestCrud.updateOne({ name: 'Non-existent' }, { active: false })).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('updateMany', () => {
    it('should update multiple documents', async () => {
      // Arrange
      await TestCrud.create({ name: 'Document 1', active: true });
      await TestCrud.create({ name: 'Document 2', active: true });
      await TestCrud.create({ name: 'Document 3', active: false });

      // Act
      const result = await TestCrud.updateMany({ active: true }, { active: false });

      // Assert
      expect(result.modifiedCount).toBe(2);
    });
  });

  describe('createOrUpdateIfExist', () => {
    it('should create document if not exists', async () => {
      // Act
      const result = await TestCrud.createOrUpdateIfExist(
        { name: 'New Document' },
        { name: 'New Document', description: 'Created via upsert' }
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('New Document');
      expect(result.description).toBe('Created via upsert');
    });

    it('should update document if exists', async () => {
      // Arrange
      await TestCrud.create({ name: 'Existing Document' });

      // Act
      const result = await TestCrud.createOrUpdateIfExist(
        { name: 'Existing Document' },
        { description: 'Updated via upsert' }
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('Existing Document');
      expect(result.description).toBe('Updated via upsert');
    });
  });

  describe('deleteById', () => {
    it('should delete document by id', async () => {
      // Arrange
      const created = await TestCrud.create({ name: 'To Delete' });

      // Act
      const deleted = await TestCrud.deleteById(created._id!);

      // Assert
      expect(deleted).toBeDefined();
      expect(deleted._id.toString()).toBe(created._id.toString());

      // Verify deletion
      await expect(TestCrud.findById(created._id!)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for non-existent id', async () => {
      // Act & Assert
      await expect(TestCrud.deleteById('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteOne', () => {
    it('should delete one document matching filter', async () => {
      // Arrange
      await TestCrud.create({ name: 'Document 1' });
      await TestCrud.create({ name: 'Document 2' });

      // Act
      const deleted = await TestCrud.deleteOne({ name: 'Document 1' });

      // Assert
      expect(deleted).toBeDefined();
      expect(deleted.name).toBe('Document 1');

      // Verify only one was deleted
      const remaining = await TestCrud.findMany({});
      expect(remaining).toHaveLength(1);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple documents', async () => {
      // Arrange
      await TestCrud.create({ name: 'Document 1', active: true });
      await TestCrud.create({ name: 'Document 2', active: true });
      await TestCrud.create({ name: 'Document 3', active: false });

      // Act
      const result = await TestCrud.deleteMany({ active: true });

      // Assert
      expect(result.deletedCount).toBe(2);

      // Verify deletion
      const remaining = await TestCrud.findMany({});
      expect(remaining).toHaveLength(1);
    });
  });

  describe('exists', () => {
    it('should return true if document exists', async () => {
      // Arrange
      await TestCrud.create({ name: 'Existing Document' });

      // Act
      const exists = await TestCrud.exists({ name: 'Existing Document' });

      // Assert
      expect(exists).toBe(true);
    });

    it('should return false if document does not exist', async () => {
      // Act
      const exists = await TestCrud.exists({ name: 'Non-existent' });

      // Assert
      expect(exists).toBe(false);
    });
  });

  describe('getCount', () => {
    it('should return correct count of documents', async () => {
      // Arrange
      await TestCrud.create({ name: 'Document 1', active: true });
      await TestCrud.create({ name: 'Document 2', active: true });
      await TestCrud.create({ name: 'Document 3', active: false });

      // Act
      const totalCount = await TestCrud.getCount({});
      const activeCount = await TestCrud.getCount({ active: true });

      // Assert
      expect(totalCount).toBe(3);
      expect(activeCount).toBe(2);
    });
  });

  describe('assertUserOwnsResource', () => {
    it('should not throw if user owns resource', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const created = await TestCrud.create({
        name: 'User Document',
        user: userId as any,
      });

      // Act & Assert
      await expect(TestCrud.assertUserOwnsResource(created._id!, userId)).resolves.not.toThrow();
    });

    it('should throw ForbiddenError if user does not own resource', async () => {
      // Arrange
      const ownerId = '507f1f77bcf86cd799439011';
      const otherId = '507f1f77bcf86cd799439012';
      const created = await TestCrud.create({
        name: 'User Document',
        user: ownerId as any,
      });

      // Act & Assert
      await expect(TestCrud.assertUserOwnsResource(created._id!, otherId)).rejects.toThrow(
        ForbiddenError
      );
    });
  });
});
