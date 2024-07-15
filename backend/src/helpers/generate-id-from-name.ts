export const generateIdFromName = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/\s+/g, '-');
