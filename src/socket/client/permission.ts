import { Permission } from '@models/user';

import { Client } from '@models/client';

import { ClientOptions } from '.';

export default class PermissionsManager {
	private client;
	private database;
	private user;
	private server;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.database = options.database;
		this.user = options.user;
		this.server = options.server;

		this.client.on('getPermissions', (data, callback) => this.get(data, callback));
		this.client.on('addPermissions', (data, callback) => this.add(data, callback));
		this.client.on('removePermissions', (data, callback) => this.remove(data, callback));
	}

	private get: Client.Permission.get = (id, reply) => {
		if (!reply) return;

		if (typeof id !== 'string') {
			reply('That is not a valid channel id');
			return;
		}

		reply(this.database.permissions.get(id));
	};

	private add: Client.Permission.add = (data, reply) => {
		if (!reply) return;

		if (!data || !data.updated) {
			reply('You have not supplied the correct information.');
			return;
		}

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_PERMISSIONS)) {
			reply('You do not have the permission to add a permission to this user.');
			return;
		}

		const user: string = data.user ?? this.user.id;

		this.database.permissions.add(user, data.updated);

		this.server.emit('addedPermission', { user, updated: data.updated });
	};

	private remove: Client.Permission.remove = (data, reply) => {
		if (!reply) return;

		if (!data || !data.removed) {
			reply('You have not supplied the correct information.');
			return;
		}

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_PERMISSIONS)) {
			reply('You do not have the permission to remove a permission from this user.');
			return;
		}

		const user: string = data.user ?? this.user.id;

		this.database.permissions.remove(user, data.removed);

		this.server.emit('removedPermission', { user, removed: data.removed });
	};
}
