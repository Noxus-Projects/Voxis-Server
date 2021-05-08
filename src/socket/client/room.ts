import { RoomEvents } from '@models/event';
import { Permission } from '@models/user';

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

		this.client.on('joinRoom', (data) => this.joinRoom(data));
		this.client.on('leaveRoom', (data, callback?) => this.leaveRoom(data, callback));
	}

	private joinRoom(room: string): void {
		this.client.join(room);
		this.server.emit('joinedRoom', { room, user: this.user.id });
	}

	private leaveRoom(data: RoomEvents.Change, reply: (message: string) => void): void {
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
	}
}
