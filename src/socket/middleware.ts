import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import Discord from '../utils/discord';

type Next = (err?: ExtendedError | undefined) => void;

export default class Middleware {
	public static authorize(socket: Socket, next: Next): void {
		const token = socket.handshake.auth.token;

		Discord.user(token).then(([data, exists]) => {
			console.log('Token is valid: ' + exists);

			if (!exists) {
				return next(new Error('invalid token'));
			}

			socket.handshake.auth.user = data;

			next();
		});
	}
}
