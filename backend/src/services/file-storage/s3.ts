import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileStorageService } from './file-storage';

export class S3Service implements FileStorageService {
	private s3Client: S3Client;

	constructor(
		private readonly endpoint: string,
		private readonly bucket: string,
	) {
		this.s3Client = new S3Client({
			endpoint: this.endpoint,
			region: 'eu-central-1',
			forcePathStyle: true,
			credentials: {
				accessKeyId: 'ACCESS_KEY_ID',
				secretAccessKey: 'ACCESS_KEY_SECRET',
			},
		});
	}

	async getObjectSignedUrl(fileKey: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: fileKey,
		});
		const url = await getSignedUrl(this.s3Client, command, {
			expiresIn: 15 * 60,
		});
		return url;
	}

	async uploadObject(path: string, file: Express.Multer.File): Promise<string> {
		const fileKey = `${path}/${file.originalname}`;

		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: fileKey,
			Body: file.buffer,
			ContentType: file.mimetype,
		});

		await this.s3Client.send(command);

		return fileKey;
	}

	async deleteObject(fileKey: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: fileKey,
		});

		await this.s3Client.send(command);
	}
}
