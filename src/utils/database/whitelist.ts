import { DB } from '@models/database';

export default class WhitelistManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Add a user to the whitelist.
	 * @param id - The users id.
	 * @returns Whether the user was put on the whitelist.
	 */
	public add(id: string): boolean {
		if (this.has(id)) return false;

		this.db.get('whitelist').push(id).write();

		return true;
	}

	/**
	 * Check if a user is on the whitelist.
	 * @param id - The users id.
	 * @returns Whether the user is on the whitelist.
	 */
	public has(id: string): boolean {
		return this.db.get('whitelist').includes(id).value();
	}

	/**
	 * Remove a user from the whitelist.
	 * @param id - The users id.
	 */
	public remove(id: string): void {
		this.db
			.get('whitelist')
			.remove((user) => user === id)
			.write();
	}
}
