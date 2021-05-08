import { Request, Response } from 'express';

import Discord from '../utils/discord';
const discord = new Discord();

export default function login(req: Request, res: Response): void {
	if (!req.query.code) {
		res.status(401).json({ error: 'Code parameter not present' });
		return;
	}

	discord
		.token(req.query.code as string)
		.then((data) =>
			res.status(200).json({
				access_token: data.access_token,
				expires_in: data.expires_in,
				refresh_token: data.refresh_token,
			})
		)
		.catch((err) => res.status(400).json({ error: err }));
}
