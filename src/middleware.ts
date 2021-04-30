import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

type Next = (err?: ExtendedError | undefined) => void;

export default class Middleware {
	public static authorize(socket: Socket, next: Next) {
		const username = socket.handshake.auth.username;
		if (!username) {
			return next(new Error('invalid username'));
		}

		// socket.username = username;
		next();
	}
}
