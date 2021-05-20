import { Permission } from '@models/user';
import { RoomEvents } from '@models/events';

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

		this.client.on('joinRoom', (data, callback) => this.join(data, callback));
		this.client.on('leaveRoom', (data, callback) => this.leave(data, callback));
	}

	private join: RoomEvents.change = (data, reply) => {
		if (!this.database.permissions.has(this.user.id, Permission.JOIN_ROOM)) {
			reply({ error: 'You are not permitted to join this room.' });
			return;
		}

		if (!data || !data.room) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		this.client.join(data.room);
		this.server.emit('joinedRoom', { room: data.room, user: this.user.id });
	};

	private leave: RoomEvents.change = (data, reply) => {
		if (!reply) return;

		const user: string = data.user || this.user.id;

		if (
			user !== this.user.id &&
			!this.database.permissions.has(this.user.id, Permission.DISCONNECT_OTHERS)
		) {
			reply({ error: 'You are not permitted to disconnect others.' });
			return;
		}

		if (!data || !data.room) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		this.server
			.fetchSockets()
			.then((sockets) =>
				sockets
					.filter((socket) => socket.data.id === user)
					?.forEach((socket) => socket.leave(data.room))
			);

		this.server.emit('leftRoom', { room: data.room, user });
	};
}
