export type FolderRecord = {
	folder_id: string;
	folder_name: string;
	parent_id: string;
};

export type DocumentRecord = {
	document_id: string;
	folder_id: string;
	document_name: string;
	document_url: string;
};

export interface FolderRepository {
	listFolders(): Promise<{
		folderRecords: FolderRecord[];
		documentRecords: DocumentRecord[];
	}>;
	createFolder(folderName: string, parentId: string): Promise<FolderRecord>;
	renameFolder(folderId: string, newFolderName: string): Promise<FolderRecord>;
	deleteFolder(folderId: string): Promise<void>;
}

export interface DocumentRepository {
	getDocument(documentId: string): Promise<DocumentRecord>;
	createDocument(
		folderId: string,
		documentName: string,
		documentUrl: string,
	): Promise<DocumentRecord>;
	renameDocument(
		documentId: string,
		newDocumentName: string,
	): Promise<DocumentRecord>;
	deleteDocument(documentId: string): Promise<DocumentRecord>;
}
