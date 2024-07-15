import { RequestHandler } from 'express';
import { parseFoldersAndDocuments } from '../../../../helpers/parse-folders-and-documents';
import { PGFolderRepository } from '../../../../services/postgres/entity/folder.entity';
import { loadKnex } from '../../../bootstrap';

const knex = loadKnex();

export const handler: RequestHandler = async (req, res) => {
	const folderRepo = new PGFolderRepository(knex);

	let result;
	try {
		result = await folderRepo.listFolders();
	} catch (error) {
		return res.status(500).send({
			error: (<Error>error).message,
		});
	}

	return res
		.status(200)
		.send(
			parseFoldersAndDocuments(result.folderRecords, result.documentRecords),
		);
};
