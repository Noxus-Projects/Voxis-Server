import { CacheEvents } from '@models/events';
import { Permission } from '@models/user';
import { ClientOptions } from '.';

export default class CacheManager {
	private client;
	private server;
	private database;
	private user;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.server = options.server;
		this.database = options.database;
		this.user = options.user;

		this.client.on('clearCache', (callback) => this.clear(callback));
	}

	private clear: CacheEvents.clear = (reply) => {
		if (!this.database.permissions.has(this.user.id, Permission.CLEAR_CACHE)) {
			reply({ error: 'You do not have the right permissions to clear the cache' });
			return;
		}

		this.database.cache.clear();
		reply({ success: 'Cleared cache' });
	};
}
