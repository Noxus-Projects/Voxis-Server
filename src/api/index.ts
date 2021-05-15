import { Express } from 'express';

import notFound from './notFound';
import login from './login';
import refresh from './refresh';

export default function Router(app: Express): void {
	app.get('/login', login);
	app.get('/refresh', refresh);
	app.use(notFound);
}
