import { Permission } from '@models/user';
import { NicknameEvents } from '@models/events';

import { ClientOptions } from '.';

export default class NicknameManager {
	private server;
	private client;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('editNickname', (data, callback) => this.edit(data, callback));
	}

	public edit: NicknameEvents.edit = (data, reply) => {
		if (!reply) return;

		if (!data || !data.updated) {
			reply('You have not supplied the correct information.');
			return;
		}

		const user: string = data.user || this.user.id;

		if (!this.database.permissions.has(this.user.id, Permission.EDIT_NICKNAME)) {
			if (user !== this.user.id) {
				reply('You are not permitted to change other peoples nicknames.');
				return;
			}
		}

		this.database.users.editNickname(user, data.updated);

		this.server.emit('editedNickname', { user, updated: data.updated });
	};
}
