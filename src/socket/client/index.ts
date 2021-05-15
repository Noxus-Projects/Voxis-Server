import { Socket, Server } from 'socket.io';

import User, { Status } from '@models/user';
import Database from '@utils/database';

import { EventsMap } from '@models/events';
import { EmitMap } from '@models/emit';

import ChannelManager from './channel';
import RoomManager from './room';
import VoiceManager from './voice';
import PermissionsManager from './permission';
import MessagesManager from './message';
import NicknameManager from './nickname';
import UserManager from './user';
import WhitelistManager from './whitelist';

export interface ClientOptions {
	client: Socket<EventsMap, EmitMap>;
	server: Server<EventsMap, EmitMap>;
	user: User;
	database: Database;
}

export default class Client {
	public user: User;

	constructor(client: Socket, server: Server, database: Database) {
		this.user = client.handshake.auth.user;

		client.data.id = this.user.id;

		if (this.user.status === Status.ONLINE || this.user.status === Status.AWAY) {
			client.broadcast.emit('userConnected', this.user.id);
			client.on('disconnect', () => server.emit('userDisconnected', this.user.id));
		}

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
		new UserManager(options);
		new WhitelistManager(options);
	}
}
