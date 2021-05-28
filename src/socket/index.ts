import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { instrument } from '@socket.io/admin-ui';

import chalk from 'chalk';
import http from 'http';
import { hash } from 'bcrypt';

import Database from '@utils/database';
import Discord from '@utils/discord';
import User, { Status } from '@models/user';
import Client from './client';

type Next = (err?: ExtendedError) => void;

export const EXPIRY_TIME = parseInt(process.env.CACHE_TIMEOUT ?? '') || 60000;

const SALT_ROUNDS = 10;

const connectionLog = (state: string, id: string, socketId: string) =>
	console.log(chalk.yellow('SOCKET'), state, '-', chalk.cyan(id), `(${socketId})`);

export default class WebSocket {
	private io: Server;
	private db: Database;

	constructor(server: http.Server, database: Database) {
		this.io = new Server(server, {
			// path: '/socket',
			cors: {
				origin: ['http://localhost:8888', 'https://admin.socket.io'],
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});

		if (process.env.ADMIN_PASSWORD && process.env.ADMIN_USERNAME) {
			hash(process.env.ADMIN_PASSWORD, SALT_ROUNDS, (err, hash) => {
				instrument(this.io, {
					namespaceName: '/admin',
					auth: {
						password: hash,
						username: process.env.ADMIN_USERNAME ?? 'admin',
						type: 'basic',
					},
				});
			});
		}

		this.db = database;

		this.io.use((socket, next) => this.authorize(socket, next));
		this.io.on('connection', (client) => this.handleConnection(client));
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

			const user: User = {
				id: data.id,
				status: current?.status ?? Status.ONLINE,
				name: data.username,
				avatar: data.avatar,
				nickname: current?.nickname ?? '',
				permissions: current?.permissions ?? [],
				owner: data.id === process.env.OWNER,
			};

			socket.handshake.auth.user = user;

			this.db.users.set(user);

			this.db.cache.set(token, data.id);
		}

		const user = socket.handshake.auth.user;

		const isOnWhitelist = this.db.whitelist.has(user.id);

		if (!isOnWhitelist && user.id !== process.env.OWNER) {
			connectionLog(chalk.red('• Not on whitelist'), user.name, socket.id);
			return next(new Error('not on whitelist'));
		}

		next();
	}
}
