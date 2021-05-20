import { UserEvents } from '@models/events';
import { ClientOptions } from '.';

export default class UserManager {
	private server;
	private client;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;
		this.database = options.database;

		this.client.on('getUser', (id, callback) => this.get(id, callback));
		this.client.on('setStatus', (status, callback) => this.status(status, callback));
	}

	private get: UserEvents.get = (id, reply) => {
		if (!reply) return;

		if (id && typeof id !== 'string') {
			reply({ error: 'That is not a valid user id' });
			return;
		}

		const userId = id || this.user.id;

		const user = this.database.users.get(userId);

		if (!user) {
			reply({ error: 'Could not find a user with that id.' });
			return;
		}

		reply({ success: user });
	};

	private status: UserEvents.status = (status, reply) => {
		if (status && typeof status !== 'number') {
			reply({ error: 'That is not a valid status' });
			return;
		}

		this.database.users.status(this.user.id, status);
	};
}
