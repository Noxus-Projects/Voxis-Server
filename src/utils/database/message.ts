import { Message } from '@models/channel';

import { Client } from '@models/client';

import { DB } from '.';

export default class MessageManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	/**
	 * Edit a given message in a given channel.
	 * @param options - The edit options.
	 */
	public edit(options: Client.Message.Edit): Message {
		const messages = this.db.get('messages').get(options.channel);
		const old = messages.find((message) => message.id === options.id).value();

		const updated = { ...old, content: options.updated };

		messages.push(updated).write();

		return updated;
	}

	/**
	 * Get a message by its id and channel id.
	 * @param channel - The channels id.
	 * @param id - The message id.
	 * @returns The requested message.
	 */
	public get(channel: string, id: string): Message {
		return this.db
			.get('messages')
			.get(channel)
			.find((message) => message.id === id)
			.value();
	}

	/**
	 * Remove a message from a channel.
	 * @param channel - The channel to remove the message from.
	 * @param id - The id of the message to remove.
	 */
	public remove(channel: string, id: string): void {
		this.db
			.get('messages')
			.get(channel)
			.remove((message) => message.id === id)
			.write();
	}

	/**
	 * Push a message to a text channel.
	 * @param id - The id of the channel.
	 * @param message - The message that needs to be pushed.
	 */
	public push(id: string, message: Message): void {
		this.db.get('messages').get(id).push(message).write();
	}
}
