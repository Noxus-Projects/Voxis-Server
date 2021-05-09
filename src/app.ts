import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import chalk from 'chalk';
import cors from 'cors';

import { Base } from '@utils/functions';

import notFound from './api/notFound';
import login from './api/login';

export default class App {
	private api: Express;
	public server: Express;

	constructor() {
		this.server = express();
		this.api = express();

		this.server.use((req, res, next) => {
			const method = chalk.yellow(req.method.toUpperCase());
			const location = chalk.green(req.url);
			const ip = chalk.cyan(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress);

			console.log(`${method} ${location} ${ip}`);
			next();
		});

		this.server.use(cors());

		this.server.use('/api', this.api);

		this.server.use(express.static(Base('src/public')));

		const limiter = rateLimit({
			windowMs: 5 * 60 * 1000,
			max: 30,
		});

		this.api.use(limiter);

		this.routeAPI();
	}

	private routeAPI() {
		this.api.get('/login', login);
		this.api.use(notFound);
	}
}
