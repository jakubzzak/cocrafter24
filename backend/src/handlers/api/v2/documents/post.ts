import { RequestHandler } from 'express';
import { S3Service } from '../../../../services/file-storage/s3';
import { PGDocumentRepository } from '../../../../services/postgres/entity/document.entity';
import { getEnvVar, loadKnex } from '../../../bootstrap';
import { mapDocument } from '../../../response';

const knex = loadKnex();

export const handler: RequestHandler = async (req, res) => {
	const folderId: string = req.body.parentId;
	const file = req.file;

	if (!folderId) {
		return res.status(400).send({
			error: "'parentId' is required",
		});
	}
	if (!file) {
		return res.status(400).send({
			error: "'data' is required",
		});
	}

	const s3Service = new S3Service(
		getEnvVar('S3_ENDPOINT'),
		getEnvVar('S3_BUCKET'),
	);
	const documentRepo = new PGDocumentRepository(knex);
	let createdDocument;
	try {
		// TODO do we want to rebuild the hierarchy in s3 as well?
		const documentUrl = await s3Service.uploadObject(folderId, file);
		createdDocument = await documentRepo.createDocument(
			folderId,
			file.originalname,
			documentUrl,
		);
	} catch (error) {
		return res.status(409).send({
			error: (<Error>error).message,
		});
	}

	res.status(201).send(mapDocument(createdDocument));
};
