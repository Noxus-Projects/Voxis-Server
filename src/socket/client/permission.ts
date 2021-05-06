import { PermissionEvents } from '@models/event';
import { Permission } from '@models/user';

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

	/**
	 * Get the current permissions for a user.
	 * @param id - The users id.
	 * @param reply - The reply to the request.
	 */
	private get(id: string, reply: (permissions: Permission[]) => void): void {
		if (!reply) return;

		reply(this.database.permissions.get(id));
	}

	/**
	 * Add permissions to a given user.
	 * @param data - An object containing the new permission(s) and the users id.
	 * @param reply - The reply to the request.
	 */
	private add(data: PermissionEvents.Add, reply: (message: string) => void): void {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_PERMISSIONS)) {
			reply('You do not have the permission to add a permission to this user.');
			return;
		}

		const user: string = data.user ?? this.user.id;

		this.database.permissions.add(user, data.updated);

		this.server.emit('addedPermission', { user, updated: data.updated });
	}

	/**
	 * Remove permissions from a given user.
	 * @param data - An object containing the removed permission(s) and the users id.
	 * @param reply - The reply to the request.
	 */
	private remove(data: PermissionEvents.Remove, reply: (message: string) => void): void {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.MANAGE_PERMISSIONS)) {
			reply('You do not have the permission to remove a permission to this user.');
			return;
		}

		const user: string = data.user ?? this.user.id;

		this.database.permissions.remove(user, data.removed);

		this.server.emit('removedPermission', { user, removed: data.removed });
	}
}
