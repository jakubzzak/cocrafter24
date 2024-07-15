import { DocumentRecord, FolderRecord } from '../services/postgres/types';

type HTTPDocument = {
	id: string;
	name: string;
};
export const mapDocument = (document: DocumentRecord): HTTPDocument => ({
	id: document.document_id,
	name: document.document_name,
});

export type HTTPFolder = {
	id: string;
	name: string;
	children: HTTPFolder[];
	documents: HTTPDocument[];
};
export const mapFolder = (folder: FolderRecord): HTTPFolder => ({
	id: folder.folder_id,
	name: folder.folder_name,
	children: [],
	documents: [],
});
