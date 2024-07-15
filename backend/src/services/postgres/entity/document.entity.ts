import { Knex } from 'knex';
import { generateIdFromName } from '../../../helpers/generate-id-from-name';
import { DocumentRecord, DocumentRepository, FolderRecord } from '../types';

export class PGDocumentRepository implements DocumentRepository {
	constructor(private readonly knex: Knex) {}

	async getDocument(documentId: string): Promise<DocumentRecord> {
		const [documentRecord] = await this.knex('documents')
			.select('*')
			.where({ document_id: documentId });

		if (!documentRecord) {
			throw new Error('Document not found');
		}

		return documentRecord;
	}

	async createDocument(
		folderId: string,
		documentName: string,
		documentUrl: string,
	): Promise<DocumentRecord> {
		const [existingFolderRecord] = await this.knex<FolderRecord>(
			'folders',
		).where({
			folder_id: folderId,
		});
		if (!existingFolderRecord) {
			throw new Error('Folder not found');
		}

		const documentId = generateIdFromName(documentName);

		const [existingDocumentRecord] = await this.knex<DocumentRecord>(
			'documents',
		)
			.select('*')
			.where({ document_id: documentId });
		if (existingDocumentRecord) {
			throw new Error('Document already exists');
		}

		const [documentRecord] = await this.knex('documents')
			.insert({
				document_id: documentId,
				folder_id: folderId,
				document_name: documentName,
				document_url: documentUrl,
			})
			.returning('*');

		return documentRecord;
	}

	async renameDocument(
		documentId: string,
		newDocumentName: string,
	): Promise<DocumentRecord> {
		const [existingDocumentRecord] = await this.knex<DocumentRecord>(
			'documents',
		).where({ document_id: documentId });
		if (!existingDocumentRecord) {
			throw new Error('Document not found');
		}
		if (existingDocumentRecord.document_name === newDocumentName) {
			throw new Error('Document name is the same');
		}

		const [updatedDocumentRecord] = await this.knex<DocumentRecord>('documents')
			.update({ document_name: newDocumentName }) // to the contrary of the folders entity, we don't update the id here
			.where({ document_id: documentId })
			.returning('*');

		return updatedDocumentRecord;
	}

	async deleteDocument(documentId: string): Promise<DocumentRecord> {
		const [deletedDocumentRecord] = await this.knex('documents')
			.delete()
			.where({ document_id: documentId })
			.returning('*');
		if (!deletedDocumentRecord) {
			throw new Error('Document not found');
		}

		return deletedDocumentRecord;
	}
}
