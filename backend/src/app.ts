import timeout from 'connect-timeout';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { getEnvVar } from './handlers/bootstrap';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(timeout('6s'));
app.use(express.json());

app.get('/ping', (req, res) => {
	res.header('Content-Type', 'application/json').send({
		message: 'hello world, Im a server here',
		routes: app._router.stack
			.filter((route: any) => !!route.route)
			.map((route: any) => route.route.path),
	});
});

app.get('/api/v2/folders', require('./handlers/api/v2/folders/get').handler);
app.post('/api/v2/folders', require('./handlers/api/v2/folders/post').handler);
app.patch(
	'/api/v2/folders/:id',
	require('./handlers/api/v2/folders/patch').handler,
);
app.delete(
	'/api/v2/folders/:id',
	require('./handlers/api/v2/folders/delete').handler,
);

app.get(
	'/api/v2/documents/:id',
	require('./handlers/api/v2/documents/get').handler,
);
const upload = multer({ storage: multer.memoryStorage() });
app.post(
	'/api/v2/documents',
	upload.single('data'),
	require('./handlers/api/v2/documents/post').handler,
);
app.patch(
	'/api/v2/documents/:id',
	require('./handlers/api/v2/documents/patch').handler,
);
app.delete(
	'/api/v2/documents/:id',
	require('./handlers/api/v2/documents/delete').handler,
);

// bonus, this endpoint acts as a proxy, but this proxy could have been on container level as well
app.get('/api/v1/ping', async (req, res) => {
	const url = getEnvVar('LEGACY_BE_URL') + req.url;
	const result = await fetch(url);
	res.send(result.text());
});

app.listen(PORT, () => {
	console.info('Server is running on port', PORT);
});
