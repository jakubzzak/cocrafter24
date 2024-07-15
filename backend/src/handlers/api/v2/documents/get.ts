import { RequestHandler } from 'express';
import { S3Service } from '../../../../services/file-storage/s3';
import { PGDocumentRepository } from '../../../../services/postgres/entity/document.entity';
import { getEnvVar, loadKnex } from '../../../bootstrap';

const knex = loadKnex();

export const handler: RequestHandler = async (req, res) => {
	const documentId = req.params.id;
	if (!documentId) {
		return res.status(400).send({
			error: "PathParam 'documentId' is required",
		});
	}

	const documentRepo = new PGDocumentRepository(knex);
	let document;
	try {
		document = await documentRepo.getDocument(documentId);
	} catch (error) {
		return res.status(400).send({
			error: (<Error>error).message,
		});
	}

	const s3Service = new S3Service(
		getEnvVar('S3_ENDPOINT'),
		getEnvVar('S3_BUCKET'),
	);
	let signedUrl;
	try {
		signedUrl = await s3Service.getObjectSignedUrl(document.document_url);
	} catch (error) {
		return res.status(400).send({
			error: (<Error>error).message,
		});
	}

	res.status(200).send(signedUrl);
};
