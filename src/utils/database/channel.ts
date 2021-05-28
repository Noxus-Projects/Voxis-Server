import { nanoid } from 'nanoid';

import Channel from '@models/channel';
import User from '@models/user';

import { DB } from '@models/database';

export default class ChannelManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Edit an existing channel using its id.
	 * @param id - The id of the channel.
	 * @param name - The channels new name.
	 */
	public edit(id: string, name: string): Channel {
		const current = this.db.get('channels').get(id).value();

		const updated = { ...current, name };

		this.db.get('channels').set(id, updated).write();

		return { ...updated, id };
	}

	/**
	 * Create a channel with a few specified options.
	 * @param options - The channels options.
	 */
	public create({ name, creator }: { name: string; creator: User }): Channel {
		const id = nanoid();

		const channel = {
			created: Date.now(),
			creator: creator.id,
			name,
		};

		this.db.get('messages').set(id, []).write();
		this.db.get('channels').set(id, channel).write();

		return { ...channel, id };
	}

	/**
	 * Remove a channel by its id.
	 * @param id - The id of the channel to remove.
	 */
	public remove(id: string): void {
		this.db.get('messages').unset(id).write();
		this.db.get('channels').unset(id).write();
	}

	get(): Channel[];
	get(id: string): Channel[] | void;
	/**
	 * Get a channel by its id.
	 * @param id - The channel's id.
	 * @returns - The channel's information.
	 */
	public get(id?: string): Channel[] | void {
		if (!id) {
			return this.db
				.get('channels')
				.entries()
				.value()
				.map((entry) => ({ ...entry[1], id: entry[0] }));
		}

		const channel = this.db.get('channels').get(id).value();

		if (channel) {
			return [{ ...channel, id }];
		}

		return;
	}
}
