import { Socket, Server } from 'socket.io';

import User, { Status } from '@models/user';
import Database from '@utils/database';

import { EventsMap } from '@models/events';
import { EmitMap } from '@models/emit';

import PermissionsManager from './permission';
import WhitelistManager from './whitelist';
import NicknameManager from './nickname';
import MessagesManager from './message';
import ChannelManager from './channel';
import CacheManager from './cache';
import VoiceManager from './voice';
import RoomManager from './room';
import UserManager from './user';

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
		new CacheManager(options);
	}
}
