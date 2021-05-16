import { DbMessage, Message } from '@models/channel';

import { MessageEvents } from '@models/events';

import { DB } from '@models/database';

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
	public edit(options: MessageEvents.Edit): Message | void {
		const messages = this.db.get('messages').get(options.channel);
		const old = messages.find((msg) => findMessage(msg, options.id)).value();

		if (!old) return;

		const updated = { ...old, content: options.updated };

		messages.remove((msg) => findMessage(msg, options.id)).write();
		messages.push(updated).write();

		return { ...updated, id: options.id };
	}

	get(channel: string, options: { from: number; to: number }): Message[];
	get(channel: string, id: string): Message | undefined;
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

		const message = this.db
			.get('messages')
			.get(channel)
			.find((msg) => findMessage(msg, options))
			.value();

		if (message)
			return {
				...message,
				id: options,
			};

		return;
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
