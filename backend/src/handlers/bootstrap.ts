import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

export const getEnvVar = (name: string): string => {
	const v = process.env[name];
	if (!v) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return v;
};

export const loadKnex = () => {
	const pg = knex({
		client: 'pg',
		connection: getEnvVar('DATABASE_URL'),
		pool: { min: 1, max: 50 },
	});

	return pg;
};
