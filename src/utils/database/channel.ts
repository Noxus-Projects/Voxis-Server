import Channel from '@models/channel';
import User from '@models/user';

import { DB } from '.';

export default class ChannelManager {
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
			messages: {},
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
}
