import { Knex } from 'knex';
import { generateIdFromName } from '../../../helpers/generate-id-from-name';
import { DocumentRecord, FolderRecord, FolderRepository } from '../types';

export class PGFolderRepository implements FolderRepository {
	constructor(private knex: Knex) {}

	async listFolders(): Promise<{
		folderRecords: FolderRecord[];
		documentRecords: DocumentRecord[];
	}> {
		const folderRecords = await this.knex<FolderRecord>('folders').select('*');

		if (folderRecords.length === 0) {
			throw new Error('No folders found');
		}
		if (
			!folderRecords.find(folderRecord => folderRecord.folder_id === 'root')
		) {
			throw new Error('Root folder not found');
		}

		const documentRecords = await this.knex<DocumentRecord>('documents')
			.select('*')
			.whereIn(
				'folder_id',
				folderRecords.map(folder => folder.folder_id),
			);

		return { folderRecords, documentRecords };
	}

	async createFolder(
		parentId: string,
		folderName: string = `folder-${new Date().getTime()}`,
	): Promise<FolderRecord> {
		const folderId = generateIdFromName(folderName);

		const [[parentFolderRecord], [existingFolderRecord]] = await Promise.all([
			this.knex('folders').select('*').where({ folder_id: parentId }),
			this.knex('folders').select('*').where({ folder_id: folderId }),
		]);
		if (!parentFolderRecord) {
			throw new Error(`ParentFolder<${parentId}> not found`);
		}
		if (existingFolderRecord) {
			throw new Error('Folder already exists');
		}

		const [createdFolderRecord] = await this.knex<FolderRecord>('folders')
			.insert({
				folder_id: folderId,
				folder_name: folderName,
				parent_id: parentId,
			})
			.returning('*');

		return createdFolderRecord;
	}

	async renameFolder(
		folderId: string,
		newFolderName: string,
	): Promise<FolderRecord> {
		const newFolderId = generateIdFromName(newFolderName); // not sure if we can afford this, depends on the dependencies
		if (newFolderId === folderId) {
			throw new Error('Same name provided');
		}

		const [existingFolderRecord] = await this.knex<FolderRecord>('folders')
			.select('*')
			.where({ folder_id: newFolderId })
			.returning('*');
		if (existingFolderRecord) {
			throw new Error('Folder already exists');
		}

		const updatedFolderRecord = await this.knex.transaction(async trx => {
			const [[updatedFolderRecord]] = await Promise.all([
				trx('folders')
					.update({ folder_id: newFolderId, folder_name: newFolderName })
					.where({ folder_id: folderId })
					.returning('*'),
				trx('folders')
					.update({ parent_id: newFolderId })
					.where({ parent_id: folderId }),
			]);

			return updatedFolderRecord;
		});

		return updatedFolderRecord;
	}

	async deleteFolder(folderId: string): Promise<void> {
		if (folderId === 'root') {
			throw new Error('Cannot delete root folder');
		}

		const [deletedFolderRecord] = await this.knex<FolderRecord>('folders')
			.where({ folder_id: folderId })
			.delete()
			.returning('*');

		if (!deletedFolderRecord) {
			throw new Error('Folder not found');
		}
	}
}
