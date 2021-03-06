import { Permission } from '@models/user';

import { DB } from '@models/database';
import { allPermissions } from './user';

export default class PermissionManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Check if a user has a given permission.
	 * @param id - The users id.
	 * @param permission - The permission.
	 * @returns Whether or not the user has the permission.
	 */
	public has(id: string, permission: Permission): boolean {
		if (id === process.env.OWNER) {
			return true;
		}

		return this.db.get('users').get(id).get('permissions').includes(permission).value();
	}

	/**
	 * Get a users permissions.
	 * @param id - The users id.
	 * @returns The requested permissions.
	 */
	public get(id: string): Permission[] | void {
		if (id === process.env.OWNER) {
			return allPermissions();
		}

		if (!this.db.get('users').get(id).value()) {
			return;
		}

		return this.db.get('users').get(id).get('permissions').value();
	}

	/**
	 * Remove permissions from a user.
	 * @param id - The users id.
	 * @param permission The permission to add.
	 */
	public remove(id: string, permissions: Permission[]): void {
		this.db
			.get('users')
			.get(id)
			.get('permissions')
			.remove(...permissions)
			.write();
	}

	/**
	 * Add a permission to a user.
	 * @param id - The users id.
	 * @param permission The permission to add.
	 */
	public add(id: string, permissions: Permission[]): void {
		const unique = this.db
			.get('users')
			.get(id)
			.get('permissions')
			.push(...permissions)
			.uniq()
			.value();

		this.db.get('users').get(id).set('permissions', unique).write();
	}
}
