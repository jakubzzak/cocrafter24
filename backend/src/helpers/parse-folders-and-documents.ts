import { DocumentRecord, FolderRecord } from 'src/services/postgres/types';
import { HTTPFolder, mapDocument } from '../handlers/response';

export const parseFoldersAndDocuments = (
	foldersRecords: FolderRecord[],
	documentRecords: DocumentRecord[],
): HTTPFolder => {
	const rootFolder = foldersRecords.find(
		folderRecord => folderRecord.parent_id === '_',
	);
	if (!rootFolder) {
		throw new Error('Root folder not found');
	}

	const res: HTTPFolder = {
		id: rootFolder.folder_id,
		name: rootFolder.folder_name,
		children: [],
		documents: documentRecords
			.filter(doc => doc.folder_id === rootFolder.folder_id)
			.map(mapDocument),
	};

	addChildren(res, foldersRecords, documentRecords, foldersRecords.length, 1);

	return res;
};

const addChildren = (
	folder: HTTPFolder,
	foldersRecords: FolderRecord[],
	documentRecords: DocumentRecord[],
	maxDepth: number,
	currentDepth: number,
): void => {
	if (currentDepth > maxDepth) {
		throw new Error('Max depth reached, loop detected');
	}

	const subFolderRecords = foldersRecords.filter(
		folderRecord => folderRecord.parent_id === folder.id,
	);
	if (subFolderRecords.length === 0) {
		return;
	}

	folder.children = subFolderRecords.map(subFolderRecord => ({
		id: subFolderRecord.folder_id,
		name: subFolderRecord.folder_name,
		children: [],
		documents: documentRecords
			.filter(doc => doc.folder_id === subFolderRecord.folder_id)
			.map(mapDocument),
	}));
	folder.children.forEach(child => {
		addChildren(
			child,
			foldersRecords,
			documentRecords,
			maxDepth,
			currentDepth + 1,
		);
	});
};
