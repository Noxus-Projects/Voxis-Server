import { Socket, Server } from 'socket.io';

import User from '@models/user';
import Database from '@utils/database';

import ChannelManager from './channel';
import RoomManager from './room';
import VoiceManager from './voice';
import PermissionsManager from './permission';
import MessagesManager from './message';

const avatarURL = (id: string, avatar: string) =>
	`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

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

		this.user = {
			id: data.id,
			name: data.username,
			picture: avatarURL(data.id, data.avatar),
			permissions: database.permissions.get(data.id),
		};

		database.users.create(this.user);

		const options: ClientOptions = {
			database,
			client,
			server,
			user: this.user,
		};

		new RoomManager(options);
		new VoiceManager(options);
		new ChannelManager(options);
		new PermissionsManager(options);
		new MessagesManager(options);
	}
}
