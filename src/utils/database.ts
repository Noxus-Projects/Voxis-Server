import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import Channel, { Message } from '../models/channel';
import User, { Permission } from '../models/user';

interface Schema {
	channels: Record<string, Channel>;
	users: Record<string, User>;
}

type DB = low.LowdbSync<Schema>;

class ChannelManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Edit an existing channel using its id.
	 * @param id - The id of the channel.
	 * @param updated - The new channel.
	 */
	public edit(id: string, name: string): Channel {
		const current = this.db.get('channels').get(id).value();

		const updated = { ...current, name };

		this.db.get('channels').set(id, updated).write();

		return updated;
	}

	/**
	 * Create a channel with a few specified options.
	 * @param options - The channels options.
	 */
	public create({ name, creator }: { name: string; creator: User }): Channel | void {
		const exists = !this.db
			.get('channels')
			.values()
			.find((channel) => channel.name === name)
			.isUndefined()
			.value();

		if (exists) return;

		const channel = {
			messages: [],
			id: Date.now().toString(),
			created: new Date(),
			creator: creator.id,
			name,
		};

		this.db.get('channels').set(channel.id, channel).write();

		return channel;
	}

	/**
	 * Remove a channel by its id.
	 * @param id - The id of the channel to remove.
	 */
	public remove(id: string): void {
		this.db.get('channels').unset(id).write();
	}

	get(): Channel[];
	get(id: string): Channel;
	/**
	 * Get a channel by its id.
	 * @param id - The channel's id.
	 * @returns - The channel's information.
	 */
	public get(id?: string): Channel | Channel[] {
		if (!id) {
			return this.db.get('channels').values().value();
		}

		return this.db
			.get('channels')
			.find((channel) => channel.id === id)
			.value();
	}

	/**
	 * Push a message to a text channel.
	 * @param id - The id of the channel.
	 * @param message - The message that needs to be pushed.
	 */
	public push(id: string, message: Message): void {
		this.db
			.get('channels')
			.find((channel) => channel.id === id)
			.get('messages')
			.push(message)
			.write();
	}
}

class PermissionManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Get a users permissions.
	 * @param id - The users id.
	 * @returns The requested permissions.
	 */
	public get(id: string): Permission[] {
		return this.db
			.get('users')
			.find((user) => user.id === id)
			.get('permissions')
			.value();
	}

	/**
	 * Remove a permission to a user.
	 * @param id - The users id.
	 * @param permission The permission to add.
	 */
	public remove(id: string, permissions: Permission[]): void {
		this.db
			.get('users')
			.find((user) => user.id === id)
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
		this.db
			.get('users')
			.find((user) => user.id === id)
			.get('permissions')
			.push(...permissions)
			.write();
	}
}

class UserManager {
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

export default class Database {
	private db: DB;

	public channels: ChannelManager;
	public permissions: PermissionManager;
	public users: UserManager;

	constructor() {
		const adapter = new FileSync<Schema>(process.cwd() + '/data/db.json');
		this.db = low(adapter);

		this.db.defaults({ channels: {}, users: {} }).write();

		this.channels = new ChannelManager(this.db);
		this.permissions = new PermissionManager(this.db);
		this.users = new UserManager(this.db);
	}
}
