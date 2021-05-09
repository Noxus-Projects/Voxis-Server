import express, { Express, Request } from 'express';
import rateLimit from 'express-rate-limit';
import chalk from 'chalk';
import cors from 'cors';

import { Base } from '@utils/functions';

import notFound from './api/notFound';
import login from './api/login';

const getIpAdress = (req: Request) =>
	(req.headers['cf-connecting-ip'] ? req.headers['cf-connecting-ip'][0] : null) ??
	(req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'][0] : null) ??
	req.socket.remoteAddress ??
	'';

export default class App {
	private api: Express;
	public server: Express;

	constructor() {
		this.server = express();
		this.api = express();

		this.server.use((req, res, next) => {
			const method = chalk.yellow(req.method.toUpperCase());
			const location = chalk.green(req.url);
			const ip = chalk.cyan(getIpAdress(req));

			console.log(`${method} ${location} ${ip}`);
			next();
		});

		this.server.use(cors());

		this.server.use('/api', this.api);

		this.server.use(express.static(Base('public')));

		const limiter = rateLimit({
			windowMs: 5 * 60 * 1000,
			max: 30,
			keyGenerator: getIpAdress,
		});

		this.api.use(limiter);

		this.routeAPI();
	}

	private routeAPI() {
		this.api.get('/login', login);
		this.api.use(notFound);
	}
}
