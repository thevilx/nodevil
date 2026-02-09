export interface UploadResult {
  url: string;
}

export interface StorageDriverInterface {
  upload(
    folderName: string,
    fileName: string,
    mimeType: string,
    fileContent: any
  ): Promise<UploadResult>;
  delete?(url: string): Promise<void>;
}
