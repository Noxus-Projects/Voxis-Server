import { DbMessage, Message } from '@models/channel';

import { Client } from '@models/client';

import { DB } from '.';

const findMessage = (message: DbMessage, id: string) => message.created.toString() === id;

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
		const old = messages.find((msg) => findMessage(msg, options.id)).value();

		const updated = { ...old, content: options.updated };

		messages.remove((msg) => findMessage(msg, options.id)).write();
		messages.push(updated).write();

		return { ...updated, id: options.id };
	}

	get(channel: string, options: { from: number; to: number }): Message[];
	get(channel: string, id: string): Message;
	/**
	 * Get a message by its id and channel id.
	 * @param channel - The channels id.
	 * @param id - The message id.
	 * @returns The requested message.
	 */
	public get(
		channel: string,
		options: string | { from: number; to: number }
	): Message | Message[] | void {
		if (typeof options !== 'string') {
			return this.db
				.get('messages')
				.get(channel)
				.slice(options.from, options.to)
				.entries()
				.value()
				.map((entry) => ({ ...entry[1], id: entry[0] }));
		}

		return {
			...this.db
				.get('messages')
				.get(channel)
				.find((msg) => findMessage(msg, options))
				.value(),
			id: options,
		};
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
			.remove((msg) => findMessage(msg, id))
			.write();
	}

	/**
	 * Push a message to a text channel.
	 * @param channel - The id of the channel.
	 * @param message - The message that needs to be pushed.
	 */
	public push(channel: string, message: Message): void {
		const { id, ...rest } = message;

		this.db.get('messages').get(channel).push(rest).write();
	}
}
