import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

import Channel, { Message } from '@models/channel';
import { Base } from '@utils/functions';
import { DbUser } from '@models/user';

import WhitelistManager from './whitelist';
import ChannelManager from './channel';
import MessageManager from './message';
import UserManager from './user';
import PermissionManager from './permission';

interface Schema {
	channels: Record<string, Channel>;
	users: Record<string, DbUser>;
	whitelist: Array<string>;
	messages: Record<string, Array<Message>>;
}

export type DB = low.LowdbSync<Schema>;

export default class Database {
	private db: DB;

	public channels: ChannelManager;
	public messages: MessageManager;
	public permissions: PermissionManager;
	public users: UserManager;
	public whitelist: WhitelistManager;

	constructor() {
		const adapter = new FileSync<Schema>(Base('/data/db.json'));
		this.db = low(adapter);

		this.db.defaults({ channels: {}, users: {}, whitelist: [], messages: {} }).write();

		this.channels = new ChannelManager(this.db);
		this.permissions = new PermissionManager(this.db);
		this.users = new UserManager(this.db);
		this.messages = new MessageManager(this.db);
		this.whitelist = new WhitelistManager(this.db);
	}
}
