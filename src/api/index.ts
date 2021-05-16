import express, { NextFunction, Request, Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import { getIpAdress } from '@utils/functions';
import Database from '@utils/database';
import Discord from '@utils/discord';

import rateLimitReached from './rateLimit';
import notFound from './notFound';
import refresh from './refresh';
import login from './login';

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 30,
	handler: rateLimitReached,
	keyGenerator: getIpAdress,
});

const authCheck = 'Bearer ';

export default class API {
	public app: Router;
	private database: Database;

	constructor() {
		this.app = express.Router();
		this.database = new Database();

		this.router();
	}

	private router(): void {
		/**	Allow cross site access of the api. */
		this.app.use(cors());

		/**	Use Rate limiter on api. */
		this.app.use(limiter);

		this.app.get('/login', login);
		this.app.get('/refresh', refresh);

		this.app.use(this.authorize);

		this.app.get('/channel/:id', (r, s) => this.channel(r, s));
		this.app.get('/user/:id', (r, s) => this.user(r, s));

		this.app.use(notFound);
	}

	private async authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.headers.authorization?.startsWith(authCheck)) {
			res.status(401).json({ error: 'No refresh token in Authorization header present' });
			return;
		}

		const token = req.headers.authorization.slice(authCheck.length);

		const [data, exists] = await Discord.user(token);

		if (!exists || !data) {
			res.status(400).json({ error: 'Invalid token' });
			return;
		}

		next();
	}

	private channel(req: Request, res: Response): void {
		const channel = this.database.channels.get(req.params.id);

		if (typeof channel === 'string') {
			res.json({ error: channel });
			return;
		}

		res.json(channel[0]);
	}

	private user(req: Request, res: Response): void {
		const user = this.database.users.get(req.params.id);

		if (!user) {
			res.json({ error: 'Could not find a user with that id.' });
			return;
		}

		res.json(user);
	}
}
