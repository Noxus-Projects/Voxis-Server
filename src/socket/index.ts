import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import chalk from 'chalk';
import http from 'http';

import Database from '@utils/database';
import Discord from '@utils/discord';
import Client from './client';

type Next = (err?: ExtendedError) => void;

const connectionLog = (state: string, id: string, socketId: string) =>
	console.log(chalk.yellow('SOCKET'), state, chalk.cyan(id), `(${socketId})`);

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

		this.io.use((socket, next) => this.authorize(socket, next));
		this.io.on('connection', (client) => this.handleConnection(client));

		this.addOwner();
	}

	private addOwner() {
		const owner = process.env.OWNER ?? '';

		this.db.whitelist.add(owner);
	}

	private async handleConnection(socket: Socket) {
		const user = socket.handshake.auth.user;

		connectionLog(chalk.green('•'), user.username, socket.id);

		new Client(socket, this.io, this.db);

		socket.on('disconnect', () => connectionLog(chalk.red('•'), user.username, socket.id));
	}

	private authorize(socket: Socket, next: Next): void {
		const token = socket.handshake.auth.token;

		connectionLog(chalk.yellow('•'), 'Unknown user', socket.id);

		Discord.user(token).then(([data, exists]) => {
			if (!exists || !data) {
				connectionLog(chalk.red('•'), 'Unknown user', socket.id);
				return next(new Error('invalid token'));
			}

			const isOnWhitelist = this.db.whitelist.has(data.id);

			if (!isOnWhitelist) {
				connectionLog(chalk.red('•'), data.username, socket.id);
				return next(new Error('not on whitelist'));
			}

			socket.handshake.auth.user = data;

			next();
		});
	}
}
