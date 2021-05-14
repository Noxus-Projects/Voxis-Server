import User from '@models/user';

import { DB } from '@models/database';

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
	 * Edit a users nickname.
	 * @param id - The users id.
	 * @param updated - The new nickname.
	 */
	public editNickname(id: string, updated: string): void {
		this.db.get('users').get(id).set('nickname', updated).write();
	}

	/**
	 * Get a user by its id.
	 * @param id - The users id.
	 */
	public get(id: string): User | undefined {
		const user = this.db.get('users').get(id).value();

		if (user) {
			return { ...user, id };
		}

		return;
	}

	/**
	 * Creates a user in the database.
	 * @param user - The user to add.
	 */
	public create(user: User): void {
		const { id, ...rest } = user;
		this.db.get('users').set(id, rest).write();
	}

	/**
	 * Removes a user from the database.
	 * @param user - The user to remove.
	 */
	public remove(user: User): void {
		this.db.get('users').unset(user.id).write();
	}
}
