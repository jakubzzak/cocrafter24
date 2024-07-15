import { RequestHandler } from 'express';
import { PGFolderRepository } from '../../../../services/postgres/entity/folder.entity';
import { loadKnex } from '../../../bootstrap';
import { mapFolder } from '../../../response';

const knex = loadKnex();

export const handler: RequestHandler = async (req, res) => {
	const folderId = req.params.id;
	const name = req.body.name;

	if (!name) {
		return res.status(400).send({
			error: "'name' is required",
		});
	}

	const folderRepo = new PGFolderRepository(knex);

	let updatedFolder;
	try {
		updatedFolder = await folderRepo.renameFolder(folderId, name);
	} catch (error) {
		return res.status(409).send({
			error: (<Error>error).message,
		});
	}

	res.status(200).send(mapFolder(updatedFolder));
};
