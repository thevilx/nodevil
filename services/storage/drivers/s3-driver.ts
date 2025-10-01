import {
  PutObjectCommand,
  PutObjectRequest,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { AppConfig } from '../../../config/app/app_config';
import { StorageDriverInterface, UploadResult } from '../storage-driver';

export class S3Driver implements StorageDriverInterface {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: AppConfig.AWS_S3_REGION,
      credentials: {
        accessKeyId: AppConfig.AWS_S3_PUBLIC!,
        secretAccessKey: AppConfig.AWS_S3_SECRET!,
      },
    });
  }

  async upload(
    folderName: string,
    fileName: string,
    mimeType: string,
    fileContent: any
  ): Promise<UploadResult> {
    fileName = fileName.replace(/[^\w.-]/gi, '-');
    const uniqueFileName = `${folderName}/${Date.now()}-${fileName}`;

    const params: PutObjectRequest = {
      Bucket: AppConfig.AWS_S3_BUCKET || '',
      Key: uniqueFileName,
      ContentType: mimeType,
      Body: fileContent,
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);

    const fileUrl = `https://${AppConfig.AWS_S3_BUCKET}.s3.${AppConfig.AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;
    return { url: fileUrl };
  }

  async delete(url: string): Promise<void> {
    const key = url.split('/').slice(-2).join('/');

    const command = new DeleteObjectCommand({
      Bucket: AppConfig.AWS_S3_BUCKET || '',
      Key: key,
    });

    await this.s3.send(command);
  }
}
