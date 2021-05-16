import express, { Express, NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

import { Base, getIpAdress } from '@utils/functions';

import API from 'api';

export default class App {
	public server: Express;

	constructor() {
		this.server = express();

		/**	Log every incoming request to the console. */
		this.server.use(this.logInfo);

		/**	Serve static files from public folder. */
		this.server.use(express.static(Base('public')));

		const api = new API();

		/**	Redirect /api to api server. */
		this.server.use('/api', api.app);
	}

	private logInfo(req: Request, res: Response, next: NextFunction) {
		const method = chalk.yellow(req.method.toUpperCase());
		const location = chalk.green(req.url);
		const ip = chalk.cyan(getIpAdress(req));

		console.log(method, location, ip);

		next();
	}
}
