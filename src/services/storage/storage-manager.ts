import { StorageDriverInterface } from './storage-driver';
import { S3Driver } from './drivers/s3-driver';
import { LocalDriver } from './drivers/local-driver';
import { BadRequestError } from '../../utils/errors';
import { i18n } from '../../config/i18n/i18n';
import { AppConfig } from '../../config/app/app_config';

export class StorageManager {
  private static instance: StorageManager;
  private driver: StorageDriverInterface;

  private constructor() {
    this.driver = this.createDriver();
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private createDriver(): StorageDriverInterface {
    switch (AppConfig.STORAGE_DRIVER) {
      case 's3':
        return new S3Driver();
      case 'local':
        return new LocalDriver(AppConfig.LOCAL_STORAGE_PATH, AppConfig.LOCAL_STORAGE_URL);
      default:
        throw new Error(`Unsupported storage driver: ${AppConfig.STORAGE_DRIVER}`);
    }
  }

  public getDriver(): StorageDriverInterface {
    return this.driver;
  }

  public switchDriver(driverType: 's3' | 'local'): void {
    switch (driverType) {
      case 's3':
        this.driver = new S3Driver();
        break;
      case 'local':
        this.driver = new LocalDriver(AppConfig.LOCAL_STORAGE_PATH, AppConfig.LOCAL_STORAGE_URL);
        break;
      default:
        throw new Error(`Unsupported storage driver: ${driverType}`);
    }
  }

  public assertFileIsImage(mimeType: string): void {
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
      throw new BadRequestError(i18n.t('invalid-file-type-upload-only-image'));
    }
  }
}
