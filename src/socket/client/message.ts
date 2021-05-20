import { Permission } from '@models/user';
import { MessageEvents } from '@models/events';

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

		this.client.on('sendMessage', (data, callback) => this.send(data, callback));
		this.client.on('editMessage', (data, callback) => this.edit(data, callback));
		this.client.on('removeMessage', (data, callback) => this.remove(data, callback));
		this.client.on('getMessage', (data, callback) => this.get(data, callback));
	}

	private get: MessageEvents.get = (data, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.SEE_CHANNELS)) {
			reply({ error: 'You are not allowed to see any messages.' });
			return;
		}

		if (!data || !data.channel || data.from == null || data.to == null) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		const messages = this.database.messages.get(data.channel, { from: data.from, to: data.to });

		reply({ success: messages });
	};

	private send: MessageEvents.send = (data, reply) => {
		if (!reply) return;

		if (!this.database.permissions.has(this.user.id, Permission.SEND_MESSAGE)) {
			reply({ error: 'You are not permitted to send messages.' });
			return;
		}

		if (!data || !data.channel || !data.content) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		const channelExists = this.database.channels.get(data.channel);

		if (!channelExists) {
			reply({ error: 'That channel does not exist.' });
			return;
		}

		const message = {
			author: this.user.id,
			created: Date.now(),
			content: data.content,
			id: Date.now().toString(),
		};

		this.database.messages.push(data.channel, message);

		this.server.emit('sentMessage', { message, channel: data.channel });
	};

	private remove: MessageEvents.remove = (data, reply) => {
		if (!reply) return;

		if (!data || !data.channel || !data.id) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		const message = this.database.messages.get(data.channel, data.id);

		if (!message) {
			reply({ error: 'There is no message with that id.' });
			return;
		}

		if (!this.database.permissions.has(this.user.id, Permission.SEND_MESSAGE)) {
			if (message.author !== this.user.id) {
				reply({ error: 'You are not the author of this message.' });
				return;
			}
		}

		this.database.messages.remove(data.channel, data.id);

		this.server.emit('removedMessage', { id: message.id, channel: data.channel });
		this.database.audit.add({ type: 'removedMessage', data: message.id, user: this.user.id });
	};

	private edit: MessageEvents.edit = (data, reply) => {
		if (!reply) return;

		if (!data || !data.channel || !data.id || !data.updated) {
			reply({ error: 'You have not supplied the correct information.' });
			return;
		}

		const message = this.database.messages.get(data.channel, data.id);

		if (!message) {
			reply({ error: 'There is no message with that id.' });
			return;
		}

		if (message.author !== this.user.id) {
			reply({ error: 'You are not the author of this message.' });
			return;
		}

		const updated = this.database.messages.edit(data);

		if (!updated) {
			reply({ error: 'There is no message with that id.' });
			return;
		}

		this.server.emit('editedMessage', { message: updated, channel: data.channel });
		this.database.audit.add({ type: 'editedMessage', data: message.id, user: this.user.id });
	};
}
