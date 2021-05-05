import { Permission } from '@models/user';

import { ClientOptions } from '.';

export default class PermissionsManager {
	private client;
	private database;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.database = options.database;

		this.client.on('getPermissions', (data, callback) =>
			this.getPermissions(data, callback ?? console.log)
		);
	}

	private getPermissions(id: string, reply: (permissions: Permission[]) => void) {
		reply(this.database.permissions.get(id));
	}
}
