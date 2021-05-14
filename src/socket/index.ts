import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import chalk from 'chalk';
import http from 'http';

import Database from '@utils/database';
import Discord from '@utils/discord';
import User from '@models/user';
import Client from './client';

type Next = (err?: ExtendedError) => void;

const EXPIRY_TIME = 60000;

const connectionLog = (state: string, id: string, socketId: string) =>
	console.log(chalk.yellow('SOCKET'), state, '-', chalk.cyan(id), `(${socketId})`);

export default class WebSocket {
	private io: Server;
	private db: Database;

	constructor(server: http.Server) {
		this.io = new Server(server, {
			path: '/socket',
			cors: {
				origin: ['http://localhost:8888'],
				methods: ['GET', 'POST'],
			},
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
		const user: User = socket.handshake.auth.user;

		connectionLog(chalk.green('• Connected'), user.name, socket.id);
		socket.on('disconnect', () => connectionLog(chalk.red('• Disconnected'), user.name, socket.id));

		new Client(socket, this.io, this.db);
	}

	private async authorize(socket: Socket, next: Next): Promise<void> {
		const token = socket.handshake.auth.token;

		const cache = this.db.cache.get(token);

		if (cache && Date.now() - EXPIRY_TIME < cache.created) {
			socket.handshake.auth.user = this.db.users.get(cache.id) as User;
		} else {
			const [data, exists] = await Discord.user(token);

			if (!exists || !data) {
				connectionLog(chalk.red('• Unauthorized'), 'Unknown user', socket.id);
				return next(new Error('invalid token'));
			}

			const current = this.db.users.get(data.id);

			socket.handshake.auth.user = {
				id: data.id,
				name: data.username,
				lastConnected: Date.now(),
				avatar: data.avatar,
				nickname: current?.nickname ?? '',
				permissions: current?.permissions ?? [],
			};

			this.db.users.create(socket.handshake.auth.user);

			this.db.cache.set(token, data.id);
		}

		const user = socket.handshake.auth.user;

		const isOnWhitelist = this.db.whitelist.has(user.id);

		if (!isOnWhitelist) {
			connectionLog(chalk.red('• Not on whitelist'), user.name, socket.id);
			return next(new Error('not on whitelist'));
		}

		next();
	}
}
