import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import http from 'http';

import { MessageEvent } from '../models/event';
import Database from '../utils/database';
import Discord from '../utils/discord';
import User from '../models/user';
import Client from './client';

type Next = (err?: ExtendedError | undefined) => void;

export default class WebSocket {
	private io: Server;
	private db: Database;

	constructor(server: http.Server) {
		this.io = new Server(server, {
			cors: {
				origin: 'https://zuidnederland.be',
				methods: ['GET', 'POST'],
			},
		});

		this.db = new Database();

		this.io.use(this.authorize);
		this.io.on('connection', (client) => this.handleConnection(client));
	}

	private async handleConnection(socket: Socket) {
		console.log(`Client with id '${socket.id}' connected!`);

		const client = new Client(socket, this.io);

		socket.on('message', (data) => this.handleMessage(client.user, data));
		socket.on('disconnect', () => console.log(`Client with id '${socket.id}' disconnected!`));
	}

	private handleMessage(user: User, data: MessageEvent) {
		const message = {
			author: user,
			timestamp: new Date(),
			content: data.message,
		};

		this.io.emit('message', {
			...message,
			channel: data.channel,
		});

		this.db.push(data.channel, message);
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
