import { Request, Response } from 'express';

import Discord from '@utils/discord';
const discord = new Discord();

const authCheck = 'Bearer ';

export default function refresh(req: Request, res: Response): void {
	if (!req.headers.authorization?.startsWith(authCheck)) {
		res.status(401).json({ error: 'No refresh token in Authorization header present' });
		return;
	}

	const refreshToken = req.headers.authorization.slice(authCheck.length);

	discord
		.refresh(refreshToken)
		.then((data) =>
			res.status(200).json({
				access_token: data.access_token,
				expires_in: data.expires_in * 1000,
				refresh_token: data.refresh_token,
			})
		)
		.catch((err) => res.status(400).json({ error: err }));
}
