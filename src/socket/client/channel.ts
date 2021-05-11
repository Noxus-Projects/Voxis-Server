import { Permission } from '@models/user';

import { Client } from './client';

import { ClientOptions } from '.';

export default class ChannelManager {
	private client;
	private server;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.server = options.server;
		this.database = options.database;
		this.user = options.user;

		this.client.on('getChannel', (data, callback?) => this.get(data, callback));
		this.client.on('createChannel', (data, callback?) => this.create(data, callback));
		this.client.on('removeChannel', (data, callback?) => this.remove(data, callback));
		this.client.on('editChannel', (data, callback?) => this.edit(data, callback));
	}

	private remove: Client.Channels.remove = (id, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.REMOVE_CHANNEL)) {
			reply('You are not permitted to remove that channel.');
			return;
		}

		if (!this.database.channels.get(id)) {
			reply('There is no channel with that id.');
			return;
		}

		this.database.channels.remove(id);

		this.server.emit('removedChannel', id);
	};

	private edit: Client.Channels.edit = (options, reply) => {
		if (!reply) return;

		if (this.database.permissions.has(this.user.id, Permission.EDIT_CHANNEL)) {
			reply('You are not permitted to edit that channel.');
			return;
		}

		if (!this.database.channels.get(options.id)) {
			reply('There is no channel with that id.');
			return;
		}

		const updated = this.database.channels.edit(options.id, options.name);

		this.server.emit('updatedChannel', updated);
	};

	private get: Client.Channels.get = (id, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.SEE_CHANNELS)) {
			reply('You are not allowed to see any channels.');
			return;
		}

		reply(id ? this.database.channels.get(id) : this.database.channels.get());
	};

	private create(name: string, reply: (message: string) => void) {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.CREATE_CHANNEL)) {
			reply('You are not permitted to create a channel.');
			return;
		}

		const channel = this.database.channels.create({ name, creator: this.user });

		if (!channel) {
			reply('A channel with that name already exists.');
			return;
		}

		this.server.emit('createdChannel', channel);
	}
}
