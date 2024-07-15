import { RequestHandler } from 'express';
import { PGFolderRepository } from '../../../../services/postgres/entity/folder.entity';
import { loadKnex } from '../../../bootstrap';

const knex = loadKnex();

export const handler: RequestHandler = async (req, res) => {
	const folderId = req.params.id;

	const folderRepo = new PGFolderRepository(knex);

	try {
		await folderRepo.deleteFolder(folderId); // could be archived for some time
		// TODO delete all subfolders and documents - might take longer and thus should be handled async
	} catch (error) {
		return res.status(400).send({
			error: (<Error>error).message,
		});
	}

	res.status(204).send();
};
