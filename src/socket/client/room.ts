import { Permission } from '@models/user';

import { Client } from '@models/client';

import { ClientOptions } from '.';

export default class RoomManager {
	private server;
	private client;
	private user;
	private database;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('joinRoom', (data, callback?) => this.join(data, callback));
		this.client.on('leaveRoom', (data, callback?) => this.leave(data, callback));
	}

	private join: Client.Room.change = (data, reply) => {
		if (!this.database.permissions.has(this.user.id, Permission.JOIN_ROOM)) {
			reply('You are not permitted to join this room.');
			return;
		}

		this.client.join(data.room);
		this.server.emit('joinedRoom', { room: data.room, user: this.user.id });
	};

	private leave: Client.Room.change = (data, reply) => {
		if (!reply) return;

		const user: string = data.user ?? this.user.id;

		if (
			user !== this.user.id &&
			!this.database.permissions.has(this.user.id, Permission.DISCONNECT_OTHERS)
		) {
			reply('You are not permitted to disconnect others.');
			return;
		}

		this.client.leave(data.room);
		this.server.emit('leftRoom', { room: data.room, user });
	};
}
