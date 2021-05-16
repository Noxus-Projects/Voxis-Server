import { Permission } from '@models/user';

import { PermissionEvents } from '@models/events';

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

		this.client.on('getPermission', (data, callback) => this.get(data, callback));
		this.client.on('addPermission', (data, callback) => this.add(data, callback));
		this.client.on('removePermission', (data, callback) => this.remove(data, callback));
	}

	private get: PermissionEvents.get = (id, reply) => {
		if (!reply) return;

		if (typeof id !== 'string') {
			reply('That is not a valid user id');
			return;
		}

		reply(this.database.permissions.get(id));
	};

	private add: PermissionEvents.add = (data, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_PERMISSIONS)) {
			reply('You do not have the permission to add a permission to this user.');
			return;
		}

		if (!data || !data.updated) {
			reply('You have not supplied the correct information.');
			return;
		}

		const user: string = data.user || this.user.id;

		const filtered = data.updated.filter(
			(permission) =>
				permission > 0 &&
				permission <= Math.floor(Object.keys(Permission).length / 2) &&
				!this.database.permissions.has(user, permission)
		);

		if (filtered.length == 0) {
			reply(
				'This user either already has all the given permissions, or there are no valid permissions.'
			);
			return;
		}

		if (user === process.env.OWNER) {
			reply('This user is the owner');
			return;
		}

		this.database.permissions.add(user, filtered);

		this.server.emit('addedPermission', { user, updated: filtered });
	};

	private remove: PermissionEvents.remove = (data, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_PERMISSIONS)) {
			reply('You do not have the permission to remove a permission from this user.');
			return;
		}

		if (!data || !data.removed || (data.user && typeof data.user !== 'string')) {
			reply('You have not supplied the correct information.');
			return;
		}

		const user: string = data.user || this.user.id;

		if (user === process.env.OWNER) {
			reply('This user is the owner');
			return;
		}

		this.database.permissions.remove(user, data.removed);

		this.server.emit('removedPermission', { user, updated: data.removed });
	};
}
