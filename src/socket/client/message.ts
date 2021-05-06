import { MessageEvents } from '@models/event';
import { Permission } from '@models/user';

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

		this.client.on('sendMessage', (data, callback) =>
			this.sendMessage(data, callback ?? console.log)
		);

		this.client.on('editMessage', (data, callback) =>
			this.editMessage(data, callback ?? console.log)
		);

		this.client.on('removeMessage', (data, callback) =>
			this.removeMessage(data, callback ?? console.log)
		);
	}

	private sendMessage(data: MessageEvents.Message, reply: (message: string) => void) {
		if (!this.database.permissions.has(this.user.id, Permission.SEND_MESSAGE)) {
			reply('You are not permitted to send messages.');
			return;
		}

		const channelExists = this.database.channels.get(data.channel);

		if (!channelExists) {
			reply('That channel does not exist.');
			return;
		}

		const message = {
			author: this.user.id,
			created: new Date(),
			content: data.id,
			id: Date.now().toString(),
		};

		this.database.messages.push(data.channel, message);

		this.server.emit('message', {
			...message,
			channel: data.channel,
		});
	}

	public removeMessage(data: MessageEvents.Message, reply: (message: string) => void): void {
		const message = this.database.messages.get(data.channel, data.id);

		if (!message) {
			reply('There is no message with that id.');
			return;
		}

		if (!this.database.permissions.has(this.user.id, Permission.SEND_MESSAGE)) {
			if (message.author !== this.user.id) {
				reply('You are not the author of this message.');
				return;
			}
		}

		this.database.messages.remove(data.channel, data.id);

		this.server.emit('removedMessage', { ...message, channel: data.channel });
	}

	private editMessage(data: MessageEvents.Edit, reply: (message: string) => void) {
		const message = this.database.messages.get(data.channel, data.id);

		if (!message) {
			reply('There is no message with that id.');
			return;
		}

		if (message.author !== this.user.id) {
			reply('You are not the author of this message.');
			return;
		}

		const updated = this.database.messages.edit(data);

		this.server.emit('editedMessage', { ...updated, channel: data.channel });
	}
}
