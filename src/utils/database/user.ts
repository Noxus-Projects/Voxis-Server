import User from '@models/user';

import { DB } from '.';

export default class UserManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Check if a user exists in the database using its id.
	 * @param id - The users id.
	 * @returns If the users exists.
	 */
	public has(id: string): boolean {
		return this.db.get('users').has(id).value();
	}

	/**
	 * Get a user by its id.
	 * @param id - The users id.
	 */
	public get(id: string) {
		this.db
			.get('users')
			.find((user) => user.id === id)
			.value();
	}

	/**
	 * Creates a user in the database.
	 * @param user - The user to add.
	 */
	public create(user: User): void {
		this.db.get('users').set(user.id, user).write();
	}

	/**
	 * Removes a user from the database.
	 * @param user - The user to remove.
	 */
	public remove(user: User): void {
		this.db.get('users').unset(user.id).write();
	}
}
