import * as fs from 'fs';
import * as path from 'path';
import { LocalDriver } from '../../services/storage/drivers/local-driver';
import { S3Driver } from '../../services/storage/drivers/s3-driver';
import { StorageManager } from '../../services/storage/storage-manager';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// // Mock AWS SDK for S3Driver tests
// jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  PutObjectCommand: jest.fn(), // if you're also testing uploads
}));
// Mock the AppConfig
jest.mock('../../config/config', () => ({
  AppConfig: {
    STORAGE_DRIVER: 'local',
    AWS_S3_REGION: 'us-east-1',
    AWS_S3_PUBLIC: 'test-access-key',
    AWS_S3_SECRET: 'test-secret-key',
    AWS_S3_BUCKET: 'test-bucket',
    LOCAL_STORAGE_PATH: 'public',
    LOCAL_STORAGE_URL: '/public',
  },
}));

describe('Storage Drivers', () => {
  const testDir = path.join(process.cwd(), 'test-uploads');
  const testFileName = 'test-file.jpg';
  const testMimeType = 'image/jpeg';
  const testFileContent = Buffer.from('fake image content');

  afterEach(async () => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      await fs.promises.rm(testDir, { recursive: true, force: true });
    }
  });

  describe('LocalDriver', () => {
    let localDriver: LocalDriver;

    beforeEach(() => {
      localDriver = new LocalDriver(testDir, '/test-uploads');
    });

    describe('upload', () => {
      it('should upload file successfully', async () => {
        const result = await localDriver.upload(
          'images',
          testFileName,
          testMimeType,
          testFileContent
        );

        expect(result).toBeDefined();
        expect(result.url).toMatch(/^\/test-uploads\/images\/\d+-test-file\.jpg$/);

        // Verify file was actually written
        const urlPath = result.url.replace('/test-uploads', '');
        const filePath = path.join(testDir, urlPath);
        expect(fs.existsSync(filePath)).toBe(true);

        const fileContent = await fs.promises.readFile(filePath);
        expect(fileContent.equals(testFileContent)).toBe(true);
      });

      it('should create directory if it does not exist', async () => {
        const folderName = 'new-folder';
        const result = await localDriver.upload(
          folderName,
          testFileName,
          testMimeType,
          testFileContent
        );

        expect(result).toBeDefined();
        expect(result.url).toMatch(`/test-uploads/${folderName}/`);

        const folderPath = path.join(testDir, folderName);
        expect(fs.existsSync(folderPath)).toBe(true);
      });

      it('should sanitize file names', async () => {
        const unsafeFileName = 'test file with spaces & special chars!@#$.jpg';
        const result = await localDriver.upload(
          'images',
          unsafeFileName,
          testMimeType,
          testFileContent
        );

        expect(result.url).toMatch(
          /^\/test-uploads\/images\/\d+-test-file-with-spaces---special-chars----\.jpg$/
        );
      });

      it('should add timestamp to prevent filename conflicts', async () => {
        const result1 = await localDriver.upload(
          'images',
          testFileName,
          testMimeType,
          testFileContent
        );
        // Add small delay to ensure different timestamp
        await new Promise(resolve => setTimeout(resolve, 2));

        const result2 = await localDriver.upload(
          'images',
          testFileName,
          testMimeType,
          testFileContent
        );

        expect(result1.url).not.toBe(result2.url);
        expect(result1.url).toMatch(/\d+-test-file\.jpg$/);
        expect(result2.url).toMatch(/\d+-test-file\.jpg$/);
      });
    });

    describe('delete', () => {
      it('should delete existing file successfully', async () => {
        // First upload a file
        const uploadResult = await localDriver.upload(
          'images',
          testFileName,
          testMimeType,
          testFileContent
        );
        const urlPath = uploadResult.url.replace('/test-uploads', '');
        const filePath = path.join(testDir, urlPath);

        // Verify file exists
        expect(fs.existsSync(filePath)).toBe(true);

        // Delete the file
        await localDriver.delete(uploadResult.url);

        // Verify file was deleted
        expect(fs.existsSync(filePath)).toBe(false);
      });

      it('should not throw error when deleting non-existent file', async () => {
        const nonExistentUrl = '/test-uploads/images/non-existent.jpg';

        await expect(localDriver.delete(nonExistentUrl)).resolves.not.toThrow();
      });

      it('should handle invalid file paths gracefully', async () => {
        const invalidUrl = '/test-uploads/../../../etc/passwd';

        await expect(localDriver.delete(invalidUrl)).resolves.not.toThrow();
      });
    });

    describe('constructor', () => {
      it('should use default values when no parameters provided', () => {
        const driver = new LocalDriver();
        expect(driver).toBeDefined();
      });

      it('should create base directory if it does not exist', () => {
        const newTestDir = path.join(process.cwd(), 'new-test-dir');
        new LocalDriver(newTestDir, '/new-test');

        expect(fs.existsSync(newTestDir)).toBe(true);

        // Clean up
        fs.rmSync(newTestDir, { recursive: true, force: true });
      });
    });
  });

  describe('S3Driver', () => {
    let s3Driver: S3Driver;
    let mockS3Send: jest.Mock;
    let mockDeleteObjectCommand: jest.MockedClass<typeof DeleteObjectCommand>;
    let mockPutObjectCommand: jest.MockedClass<typeof PutObjectCommand>;

    beforeEach(() => {
      mockS3Send = jest.fn();
      mockDeleteObjectCommand = DeleteObjectCommand as jest.MockedClass<typeof DeleteObjectCommand>;
      mockPutObjectCommand = PutObjectCommand as jest.MockedClass<typeof PutObjectCommand>;

      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockS3Send,
      }));

      // Clear previous calls
      mockDeleteObjectCommand.mockClear();
      mockPutObjectCommand.mockClear();

      s3Driver = new S3Driver();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    describe('upload', () => {
      it('should upload file to S3 successfully', async () => {
        mockS3Send.mockResolvedValueOnce({});

        const result = await s3Driver.upload('images', testFileName, testMimeType, testFileContent);

        expect(result).toBeDefined();
        expect(result.url).toMatch(
          /^https:\/\/test-bucket\.s3\.us-east-1\.amazonaws\.com\/images\/\d+-test-file\.jpg$/
        );

        expect(mockS3Send).toHaveBeenCalledTimes(1);

        expect(mockPutObjectCommand).toHaveBeenCalledWith(
          expect.objectContaining({
            Bucket: 'test-bucket',
            Key: expect.stringMatching(/^images\/\d+-test-file\.jpg$/),
            ContentType: testMimeType,
            Body: testFileContent,
          })
        );
      });

      it('should sanitize file names', async () => {
        mockS3Send.mockResolvedValueOnce({});

        const unsafeFileName = 'test file with spaces & special chars!@#$.jpg';
        const result = await s3Driver.upload(
          'images',
          unsafeFileName,
          testMimeType,
          testFileContent
        );

        expect(result.url).toMatch(/images\/\d+-test-file-with-spaces---special-chars----\.jpg$/);
        expect(mockS3Send).toHaveBeenCalledTimes(1);
        expect(mockPutObjectCommand).toHaveBeenCalledWith(
          expect.objectContaining({
            Bucket: 'test-bucket',
            Key: expect.stringMatching(
              /^images\/\d+-test-file-with-spaces---special-chars----\.jpg$/
            ),
            ContentType: testMimeType,
            Body: testFileContent,
          })
        );
      });

      it('should add timestamp to prevent filename conflicts', async () => {
        mockS3Send.mockResolvedValueOnce({}).mockResolvedValueOnce({});

        const result1 = await s3Driver.upload(
          'images',
          testFileName,
          testMimeType,
          testFileContent
        );

        // Add small delay to ensure different timestamp
        await new Promise(resolve => setTimeout(resolve, 2));

        const result2 = await s3Driver.upload(
          'images',
          testFileName,
          testMimeType,
          testFileContent
        );

        expect(result1.url).not.toBe(result2.url);
        expect(result1.url).toMatch(/\d+-test-file\.jpg$/);
        expect(result2.url).toMatch(/\d+-test-file\.jpg$/);
      });

      it('should throw error if S3 upload fails', async () => {
        const uploadError = new Error('S3 upload failed');
        mockS3Send.mockRejectedValueOnce(uploadError);

        await expect(
          s3Driver.upload('images', testFileName, testMimeType, testFileContent)
        ).rejects.toThrow('S3 upload failed');
      });
    });

    describe('delete', () => {
      it('should delete file from S3 successfully', async () => {
        mockS3Send.mockResolvedValueOnce({});

        const testUrl =
          'https://test-bucket.s3.us-east-1.amazonaws.com/images/123456-test-file.jpg';
        await s3Driver.delete(testUrl);

        expect(mockS3Send).toHaveBeenCalledTimes(1);

        expect(mockDeleteObjectCommand).toHaveBeenCalledWith({
          Bucket: 'test-bucket',
          Key: 'images/123456-test-file.jpg',
        });
      });

      it('should extract correct key from URL', async () => {
        mockS3Send.mockResolvedValueOnce({});

        const testUrl = 'https://test-bucket.s3.us-east-1.amazonaws.com/folder/subfolder/file.jpg';
        await s3Driver.delete(testUrl);

        expect(mockDeleteObjectCommand).toHaveBeenCalledWith({
          Bucket: 'test-bucket',
          Key: 'subfolder/file.jpg',
        });
      });

      it('should throw error if S3 delete fails', async () => {
        const deleteError = new Error('S3 delete failed');
        mockS3Send.mockRejectedValueOnce(deleteError);

        const testUrl = 'https://test-bucket.s3.us-east-1.amazonaws.com/images/test-file.jpg';

        await expect(s3Driver.delete(testUrl)).rejects.toThrow('S3 delete failed');
      });
    });
  });

  describe('StorageManager', () => {
    beforeEach(() => {
      // Reset singleton instance
      (StorageManager as any).instance = null;
    });

    afterEach(() => {
      // Reset singleton instance
      (StorageManager as any).instance = null;
    });

    describe('getInstance', () => {
      it('should return singleton instance', () => {
        const instance1 = StorageManager.getInstance();
        const instance2 = StorageManager.getInstance();

        expect(instance1).toBe(instance2);
      });
    });

    describe('createDriver', () => {
      it('should create LocalDriver when STORAGE_DRIVER is local', () => {
        const manager = StorageManager.getInstance();
        const driver = manager.getDriver();

        // Since we mocked AppConfig.STORAGE_DRIVER as 'local', it should create LocalDriver
        expect(driver).toBeInstanceOf(LocalDriver);
      });
    });

    describe('switchDriver', () => {
      it('should switch to local driver', () => {
        const manager = StorageManager.getInstance();
        manager.switchDriver('local');

        expect(manager.getDriver()).toBeInstanceOf(LocalDriver);
      });

      it('should switch to S3 driver', () => {
        const manager = StorageManager.getInstance();
        manager.switchDriver('s3');

        expect(manager.getDriver()).toBeInstanceOf(S3Driver);
      });

      it('should throw error for unsupported driver type', () => {
        const manager = StorageManager.getInstance();

        expect(() => manager.switchDriver('unsupported' as any)).toThrow(
          'Unsupported storage driver: unsupported'
        );
      });
    });

    describe('assertFileIsImage', () => {
      let manager: StorageManager;

      beforeEach(() => {
        manager = StorageManager.getInstance();
      });

      it('should not throw for valid image mime types', () => {
        expect(() => manager.assertFileIsImage('image/jpeg')).not.toThrow();
        expect(() => manager.assertFileIsImage('image/png')).not.toThrow();
        expect(() => manager.assertFileIsImage('image/webp')).not.toThrow();
      });

      it('should throw BadRequestError for invalid mime types', () => {
        expect(() => manager.assertFileIsImage('text/plain')).toThrow();
        expect(() => manager.assertFileIsImage('application/pdf')).toThrow();
        expect(() => manager.assertFileIsImage('video/mp4')).toThrow();
      });
    });
  });
});
