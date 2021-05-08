import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import chalk from 'chalk';

import login from './api/login';
import notFound from './api/notFound';

import cors from 'cors';

export default class App {
	private api: Express;
	public server: Express;

	constructor() {
		this.server = express();
		this.api = express();

		this.server.use((req, res, next) => {
			const method = chalk.yellow(req.method.toUpperCase());
			const location = chalk.green(req.url);
			const ip = chalk.cyan(req.socket.remoteAddress);

			console.log(`${method} ${location} ${ip}`);
			next();
		});

		this.server.use(cors());

		this.server.use('/api', this.api);

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
