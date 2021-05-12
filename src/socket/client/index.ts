import { Socket, Server } from 'socket.io';

import User from '@models/user';
import Database from '@utils/database';

import ChannelManager from './channel';
import RoomManager from './room';
import VoiceManager from './voice';
import PermissionsManager from './permission';
import MessagesManager from './message';
import NicknameManager from './nickname';

export interface ClientOptions {
	client: Socket;
	server: Server;
	user: User;
	database: Database;
}

export default class Client {
	public user: User;

	constructor(client: Socket, server: Server, database: Database) {
		const data = client.handshake.auth.user;

		const current = database.users.get(data.id);

		client.data.id = data.id;

		this.user = {
			id: data.id,
			name: data.username,
			lastConnected: Date.now(),
			avatar: data.avatar,
			nickname: current?.nickname ?? '',
			permissions: current?.permissions ?? [],
		};

		database.users.create(this.user);

		const options: ClientOptions = {
			database,
			client,
			server,
			user: this.user,
		};

		new NicknameManager(options);
		new RoomManager(options);
		new VoiceManager(options);
		new ChannelManager(options);
		new PermissionsManager(options);
		new MessagesManager(options);
	}
}
