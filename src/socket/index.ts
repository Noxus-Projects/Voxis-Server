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
	console.log(chalk.yellow('SOCKET'), state, chalk.cyan(id), `(${socketId})`);

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

		connectionLog(chalk.green('•'), user.name, socket.id);

		new Client(socket, this.io, this.db);

		socket.on('disconnect', () => connectionLog(chalk.red('•'), user.name, socket.id));
	}

	private async authorize(socket: Socket, next: Next): Promise<void> {
		const token = socket.handshake.auth.token;

		const cache = this.db.cache.get(token);

		let userData: { id: string; username: string; avatar: string };

		if (cache && Date.now() - EXPIRY_TIME < cache.created) {
			const data = this.db.users.get(cache.id) as User;

			userData = {
				...data,
				username: data.name,
			};
		} else {
			const [data, exists] = await Discord.user(token);

			if (!exists || !data) {
				connectionLog(chalk.red('•'), 'Unknown user', socket.id);
				return next(new Error('invalid token'));
			}

			userData = data;

			this.db.cache.set(token, data.id);
		}

		const isOnWhitelist = this.db.whitelist.has(userData.id);

		if (!isOnWhitelist) {
			connectionLog(chalk.red('•'), userData.username, socket.id);
			return next(new Error('not on whitelist'));
		}

		const current = this.db.users.get(userData.id);

		socket.handshake.auth.user = {
			id: userData.id,
			name: userData.username,
			lastConnected: Date.now(),
			avatar: userData.avatar,
			nickname: current?.nickname ?? '',
			permissions: current?.permissions ?? [],
		};

		this.db.users.create(socket.handshake.auth.user);

		next();
	}
}
