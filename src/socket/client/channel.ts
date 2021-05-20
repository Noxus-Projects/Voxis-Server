import { Permission } from '@models/user';

import { ChannelEvents } from '@models/events';

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

	private remove: ChannelEvents.remove = (id, reply) => {
		if (!reply) return;

		if (typeof id !== 'string') {
			reply({ error: 'That is not a valid channel id' });
			return;
		}

		if (!this.database.permissions.has(this.user.id, Permission.REMOVE_CHANNEL)) {
			reply({ error: 'You are not permitted to remove that channel.' });
			return;
		}

		if (!this.database.channels.get(id)) {
			reply({ error: 'There is no channel with that id.' });
			return;
		}

		this.database.channels.remove(id);

		this.server.emit('removedChannel', id);
		this.database.audit.add({ data: id, type: 'removedChannel', user: this.user.id });
	};

	private edit: ChannelEvents.edit = (options, reply) => {
		if (!reply) return;

		if (!options || !options.id || !options.name) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		if (!this.database.permissions.has(this.user.id, Permission.EDIT_CHANNEL)) {
			reply({ error: 'You are not permitted to edit that channel.' });
			return;
		}

		if (!this.database.channels.get(options.id)) {
			reply({ error: 'There is no channel with that id.' });
			return;
		}

		const updated = this.database.channels.edit(options.id, options.name);

		this.server.emit('updatedChannel', updated);
		this.database.audit.add({ data: updated.id, type: 'editedChannel', user: this.user.id });
	};

	private get: ChannelEvents.get = (id, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.SEE_CHANNELS)) {
			reply({ error: 'You are not allowed to see any channels.' });
			return;
		}

		if (typeof id == 'string') {
			const channel = this.database.channels.get(id);

			if (!channel) {
				reply({ error: 'Could not find a channel with that id.' });
				return;
			}

			reply({ success: channel });
			return;
		}

		if (!id) {
			reply({ success: this.database.channels.get() });
			return;
		}

		reply({ error: 'That is not a valid channel id' });
	};

	private create: ChannelEvents.create = (name, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.CREATE_CHANNEL)) {
			reply({ error: 'You are not permitted to create a channel.' });
			return;
		}

		if (typeof name !== 'string') {
			reply({ error: 'That is not a valid channel name' });
			return;
		}

		const channel = this.database.channels.create({ name, creator: this.user });

		this.server.emit('createdChannel', channel);
		this.database.audit.add({ data: channel.id, type: 'createdChannel', user: this.user.id });
	};
}
