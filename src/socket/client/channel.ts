import { EditChannelEvent } from '@models/event';
import { Permission } from '@models/user';
import Channel from '@models/channel';

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

		this.client.on('getChannel', (data, callback) => this.get(data, callback));
		this.client.on('createChannel', (data, callback) => this.create(data, callback));
		this.client.on('removeChannel', (data, callback) => this.remove(data, callback));
		this.client.on('editChannel', (data, callback) => this.edit(data, callback));
	}

	private remove(id: string, reply: (message: string) => void) {
		if (this.database.permissions.has(this.user.id, Permission.REMOVE_CHANNEL)) {
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

	private edit(options: EditChannelEvent, reply: (message: string) => void) {
		if (!this.database.channels.get(options.id)) {
			reply('There is no channel with that id.');
			return;
		}

		if (this.database.permissions.has(this.user.id, Permission.EDIT_CHANNEL)) {
			reply('You are not permitted to edit that channel.');
			return;
		}

		const updated = this.database.channels.edit(options.id, options.name);

		this.server.emit('updatedChannel', updated);
	}

	private get(id: string | null, reply: (channel: Channel | Channel[]) => void) {
		reply(id ? this.database.channels.get(id) : this.database.channels.get());
	}

	private create(name: string, reply: (message: string) => void) {
		if (this.database.permissions.has(this.user.id, Permission.CREATE_CHANNEL)) {
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
