import { MessageEvents } from '@models/event';

import { ClientOptions } from '.';

export default class MessagesManager {
	private server;
	private client;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('sendMessage', (data) => this.sendMessage(data));
		this.client.on('editMessage', (data, callback) => this.editMessage(data, callback));
	}

	private sendMessage(data: MessageEvents.MessageEvent) {
		const message = {
			author: this.user.id,
			timestamp: new Date(),
			content: data.message,
			id: Date.now().toString(),
		};

		this.server.emit('message', {
			...message,
			channel: data.channel,
		});

		this.database.messages.push(data.channel, message);
	}

	private editMessage(data: MessageEvents.EditMessageEvent, reply: (message: string) => void) {
		const message = this.database.messages.get(data.channel, data.id);

		if (message.author !== this.user.id) {
			reply('You are not the author of this message.');
			return;
		}

		const updated = this.database.messages.edit(data);

		this.server.emit('editedMessage', updated);
	}
}
