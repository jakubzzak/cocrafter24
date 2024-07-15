import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable('folders', table => {
			table.string('folder_id').primary();
			table.string('folder_name').notNullable();
			table.string('parent_id').notNullable();
		})
		.createTable('documents', table => {
			table.string('document_id').primary();
			table
				.string('folder_id')
				.notNullable()
				.references('folder_id')
				.inTable('folders')
				.onDelete('CASCADE')
				.onUpdate('CASCADE');
			table.string('document_name').notNullable();
			table.string('document_url').notNullable();
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('documents').dropTable('folders');
}
