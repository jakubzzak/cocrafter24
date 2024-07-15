export interface FileStorageService {
	getObjectSignedUrl(fileKey: string): Promise<string>;
	uploadObject(path: string, file: Express.Multer.File): Promise<string>;
	deleteObject(fileKey: string): Promise<void>;
}
