import { RequestHandler } from 'express';
import { PGDocumentRepository } from '../../../../services/postgres/entity/document.entity';
import { loadKnex } from '../../../bootstrap';
import { mapDocument } from '../../../response';

const knex = loadKnex();

export const handler: RequestHandler = async (req, res) => {
	const documentId = req.params.id;
	if (!documentId) {
		return res.status(400).send({
			error: "PathParam 'documentId' is required",
		});
	}

	const name: string = req.body.name;
	if (!name) {
		return res.status(400).send({
			error: "'name' is required",
		});
	}

	const documentRepo = new PGDocumentRepository(knex);

	let updatedDocument;
	try {
		updatedDocument = await documentRepo.renameDocument(documentId, name);
	} catch (error) {
		return res.status(409).send({
			error: (<Error>error).message,
		});
	}

	res.status(200).send(mapDocument(updatedDocument));
};
