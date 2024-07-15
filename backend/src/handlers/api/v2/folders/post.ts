import { RequestHandler } from 'express';
import { PGFolderRepository } from '../../../../services/postgres/entity/folder.entity';
import { loadKnex } from '../../../bootstrap';
import { mapFolder } from '../../../response';

const knex = loadKnex();
const ROOT_PARENT_ID = 'root';

export const handler: RequestHandler = async (req, res) => {
	const parentId = req.body.parentId ?? ROOT_PARENT_ID;

	const folderRepo = new PGFolderRepository(knex);
	let createdFolder;
	try {
		createdFolder = await folderRepo.createFolder(parentId);
	} catch (error) {
		return res.status(409).send({
			error: (<Error>error).message,
		});
	}

	res.status(201).send(mapFolder(createdFolder));
};
