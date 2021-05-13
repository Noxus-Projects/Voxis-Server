import { Permission } from '@models/user';
import { VoiceEvents } from '@models/events';

import { ClientOptions } from '.';

export default class VoiceManager {
	private client;
	private user;
	private database;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('voiceData', (data) => this.voice(data));
	}

	private voice: VoiceEvents.send = (data) => {
		if (!this.database.permissions.has(this.user.id, Permission.SPEAK)) {
			return;
		}

		this.client.rooms.forEach((room) =>
			this.client.to(room).emit('voice', { user: this.user.id, data })
		);
	};
}
