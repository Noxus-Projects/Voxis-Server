import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import http from 'http';

import Discord from '../utils/discord';
import Client from './client';

type Next = (err?: ExtendedError | undefined) => void;

export default class WebSocket {
	private io: Server;

	constructor(server: http.Server) {
		this.io = new Server(server);

		this.io.use(this.authorize);
		this.io.on('connection', (client) => this.handleConnection(client));
	}

	private async handleConnection(client: Socket) {
		console.log(`Client with id '${client.id}' connected!`);

		const event = new Client(client, this.io);

		client.on('disconnect', () => console.log(`Client with id '${client.id}' disconnected!`));
	}

	private authorize(socket: Socket, next: Next): void {
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
