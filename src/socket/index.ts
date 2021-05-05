import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import http from 'http';

import Database from '../utils/database';
import Discord from '../utils/discord';
import Client from './client';

type Next = (err?: ExtendedError | undefined) => void;

export default class WebSocket {
	private io: Server;
	private db: Database;

	constructor(server: http.Server) {
		this.io = new Server(server, {
			// cors: {
			// 	origin: '*',
			// 	methods: ['GET', 'POST'],
			// },
		});

		this.db = new Database();

		this.io.use(this.authorize);
		this.io.on('connection', (client) => this.handleConnection(client));
	}

	private async handleConnection(socket: Socket) {
		console.log(`Client with id '${socket.id}' connected!`);

		new Client(socket, this.io, this.db);

		socket.on('disconnect', () => console.log(`Client with id '${socket.id}' disconnected!`));
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
