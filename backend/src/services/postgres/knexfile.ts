module.exports = {
	client: 'pg',
	connection: 'postgres://postgres:postgres@db:5432/db',
	pool: { min: 1, max: 50 },
	migrations: {
		directory: ['./migrations'],
	},
	seeds: {
		directory: ['./seeds'],
	},
};
