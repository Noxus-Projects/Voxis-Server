import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import Channel, { Message, TextChannel } from '../models/channel';

interface Schema {
	channels: Array<TextChannel>;
}

export default class Database {
	private db: low.LowdbSync<Schema>;

	constructor() {
		const adapter = new FileSync<Schema>(process.cwd() + '/data/db.json');
		this.db = low(adapter);

		this.db.defaults({ channels: [] }).write();
	}

	/**
	 * Push a message to a text channel.
	 * @param id - The id of the channel.
	 * @param message - The message that needs to be pushed.
	 */
	public push(id: string, message: Message): void {
		this.db
			.get('channels')
			.find((channel) => channel.id === id && channel.type === 'text')
			.get('messages')
			.push(message)
			.write();
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
			return this.db.get('channels').value();
		}

		return this.db
			.get('channels')
			.find((channel) => channel.id === id)
			.value();
	}
}
