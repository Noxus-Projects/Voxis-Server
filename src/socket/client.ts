import { Socket, Server } from 'socket.io';

import User, { Permission } from '@models/user';
import { MessageEvent } from '@models/event';
import Database from '@utils/database';
import Channel from '@models/channel';

const avatarURL = (id: string, avatar: string) =>
	`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

interface ClientOptions {
	client: Socket;
	server: Server;
	user: User;
	database: Database;
}

class RoomManager {
	private server;
	private client;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;

		this.client.on('joinRoom', (data) => this.joinRoom(data));
		this.client.on('leaveRoom', (data) => this.leaveRoom(data));
	}

	private joinRoom(data: string): void {
		this.client.join(data);
		this.server.emit('joinedRoom', { room: data, user: this.user });
	}

	private leaveRoom(data: string): void {
		this.client.leave(data);
		this.server.emit('leftRoom', { room: data, user: this.user });
	}
}

class ChannelManager {
	private client;
	private server;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.server = options.server;
		this.database = options.database;
		this.user = options.user;

		this.client.on('getChannel', (data, callback) => this.getChannel(data, callback));
		this.client.on('createChannel', (data, callback) => this.createChannel(data, callback));
		this.client.on('removeChannel', (data, callback) => this.removeChannel(data, callback));
		this.client.on('editChannel', (data, callback) => this.editChannel(data, callback));
	}

	private removeChannel(id: string, reply: (message: string) => void) {
		const permissions = this.database.permissions.get(this.user.id);

		if (!permissions || !permissions.includes(Permission.REMOVE_CHANNEL)) {
			reply('You are not permitted to remove that channel.');
			return;
		}

		if (!this.database.channels.get(id)) {
			reply('There is no channel with that id.');
			return;
		}

		this.database.channels.remove(id);

		this.server.emit('removedChannel');
	}

	private editChannel(options: { id: string; name: string }, reply: (message: string) => void) {
		if (!this.database.channels.get(options.id)) {
			reply('There is no channel with that id.');
			return;
		}

		const permissions = this.database.permissions.get(this.user.id);

		if (!permissions || !permissions.includes(Permission.EDIT_CHANNEL)) {
			reply('You are not permitted to edit that channel.');
			return;
		}

		const updated = this.database.channels.edit(options.id, options.name);

		this.server.emit('updatedChannel', updated);
	}

	private getChannel(id: string | null, reply: (channel: Channel | Channel[]) => void) {
		reply(id ? this.database.channels.get(id) : this.database.channels.get());
	}

	private createChannel(name: string, reply: (message: string) => void) {
		const permissions = this.database.permissions.get(this.user.id);

		if (!permissions || !permissions.includes(Permission.CREATE_CHANNEL)) {
			reply('You are not permitted to create a channel.');
			return;
		}

		const channel = this.database.channels.create({ name, creator: this.user });

		if (!channel) {
			reply('A channel with that name already exists.');
			return;
		}

		this.server.emit('createdChannel', channel);
		reply(`Created channel ${channel.name}.`);
	}
}

class VoiceManager {
	private client;
	private user;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.user = options.user;

		this.client.on('voiceData', (data) => this.handleVoice(data));
	}

	private handleVoice(data: string): void {
		this.client.rooms.forEach((room) =>
			this.client.to(room).emit('voice', { user: this.user.id, data })
		);
	}
}

class PermissionsManager {
	private client;
	private database;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.database = options.database;

		this.client.on('getPermissions', (data, callback) => this.getPermissions(data, callback));
	}

	private getPermissions(id: string, reply: (permissions: Permission[]) => void) {
		reply(this.database.permissions.get(id));
	}
}

class MessagesManager {
	private server;
	private client;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('message', (data) => this.sendMessage(data));
	}

	private sendMessage(data: MessageEvent) {
		const message = {
			author: this.user,
			timestamp: new Date(),
			content: data.message,
		};

		this.server.emit('message', {
			...message,
			channel: data.channel,
		});

		this.database.channels.push(data.channel, message);
	}
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
