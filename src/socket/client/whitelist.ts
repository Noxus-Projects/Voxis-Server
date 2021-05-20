import { WhitelistEvents } from '@models/events';
import { Permission } from '@models/user';

import { ClientOptions } from '.';

export default class WhitelistManager {
	private server;
	private client;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('addWhitelist', (id, callback) => this.add(id, callback));
		this.client.on('removeWhitelist', (id, callback) => this.remove(id, callback));
	}

	private add: WhitelistEvents.add = (id, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_WHITELIST)) {
			reply({ error: 'You are not permitted to add users to the whitelist' });
			return;
		}

		if (!id || typeof id !== 'string') {
			reply({ error: 'That is not a valid user id' });
			return;
		}

		if (this.database.whitelist.has(id)) {
			reply({ error: 'That user is already whitelisted' });
			return;
		}

		this.database.whitelist.add(id);
		this.server.emit('addedWhitelist', id);
	};

	private remove: WhitelistEvents.remove = (id, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_WHITELIST)) {
			reply({ error: 'You are not permitted to remove users from the whitelist' });
			return;
		}

		if (!id || typeof id !== 'string') {
			reply({ error: 'That is not a valid user id' });
			return;
		}

		if (!this.database.whitelist.has(id)) {
			reply({ error: 'That user is not whitelisted' });
			return;
		}

		this.database.whitelist.remove(id);
		this.server.emit('removedWhitelist', id);
	};
}
