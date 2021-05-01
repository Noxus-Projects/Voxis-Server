import { Request, Response } from 'express';

import Discord from './utils/discord';
const discord = new Discord();

export default class API {
	public static login(req: Request, res: Response) {
		if (!req.query.code) {
			res.status(401).json({ error: 'Code parameter not present' });
			return;
		}

		discord
			.token(req.query.code as string)
			.then((data) => res.json(data))
			.catch((err) => res.json({ error: err }));
	}

	public static notFound(req: Request, res: Response) {
		res.status(404).json({ error: 'Not found' });
	}
}
