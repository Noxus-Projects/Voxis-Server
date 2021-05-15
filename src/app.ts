import express, { Express, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import chalk from 'chalk';
import cors from 'cors';

import { Base } from '@utils/functions';

import rateLimitReached from './api/rateLimit';

import APIRouter from 'api';

const getIpAdress = (req: Request) =>
	(req.headers['cf-connecting-ip'] ??
		req.headers['x-forwarded-for'] ??
		req.socket.remoteAddress ??
		'') as string;

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 30,
	handler: rateLimitReached,
	keyGenerator: getIpAdress,
});

export default class App {
	private api: Express;
	public server: Express;

	constructor() {
		this.server = express();
		this.api = express();

		/**	Log every incoming request to the console. */
		this.server.use(this.logInfo);

		/**	Serve static files from public folder. */
		this.server.use(express.static(Base('public')));

		/**	Redirect /api to api server. */
		this.server.use('/api', this.api);

		/**	Allow cross site access of the api. */
		this.api.use(cors());

		/**	Use Rate limiter on api. */
		this.api.use(limiter);

		APIRouter(this.api);
	}

	private logInfo(req: Request, res: Response, next: NextFunction) {
		const method = chalk.yellow(req.method.toUpperCase());
		const location = chalk.green(req.url);
		const ip = chalk.cyan(getIpAdress(req));

		console.log(method, location, ip);
		next();
	}
}
