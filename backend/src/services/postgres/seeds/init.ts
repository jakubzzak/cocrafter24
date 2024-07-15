import { Knex } from 'knex';

export const seed = async (knex: Knex) => {
	const [rootFolderRecord] = await knex('folders').where({ folder_id: 'root' });
	if (rootFolderRecord) {
		return;
	}

	await knex
		.insert({
			folder_id: 'root',
			folder_name: 'Root',
			parent_id: '_',
		})
		.into('folders');
};
