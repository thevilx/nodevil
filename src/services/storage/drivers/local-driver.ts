import * as fs from 'fs';
import * as path from 'path';
import { StorageDriverInterface, UploadResult } from '../storage-driver';

export class LocalDriver implements StorageDriverInterface {
  private readonly baseDir: string;
  private readonly baseUrl: string;

  constructor(baseDir: string = 'uploads', baseUrl: string = '/uploads') {
    this.baseDir = path.resolve(baseDir);
    this.baseUrl = baseUrl;

    this.ensureDirectoryExists(this.baseDir);
  }

  async upload(
    folderName: string,
    fileName: string,
    mimeType: string,
    fileContent: Buffer
  ): Promise<UploadResult> {
    fileName = fileName.replace(/[^\w.-]/gi, '-');
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const folderPath = path.join(this.baseDir, folderName);
    const filePath = path.join(folderPath, uniqueFileName);

    this.ensureDirectoryExists(folderPath);

    await fs.promises.writeFile(filePath, fileContent);

    const url = `${this.baseUrl}/${folderName}/${uniqueFileName}`;
    return { url };
  }

  async delete(url: string): Promise<void> {
    const relativePath = url.replace(this.baseUrl, '');
    const filePath = path.join(this.baseDir, relativePath);

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
