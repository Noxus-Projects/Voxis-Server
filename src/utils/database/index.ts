import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

import { DbChannel, Message } from '@models/channel';
import { Base } from '@utils/functions';
import { DbUser } from '@models/user';
import Action from '@models/action';

import WhitelistManager from './whitelist';
import ChannelManager from './channel';
import MessageManager from './message';
import UserManager from './user';
import PermissionManager from './permission';

interface Schema {
	channels: Record<string, DbChannel>;
	users: Record<string, DbUser>;
	whitelist: Array<string>;
	messages: Record<string, Array<Message>>;
	audit: Array<Action>;
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

		this.db.defaults({ channels: {}, users: {}, whitelist: [], messages: {}, audit: [] }).write();

		this.channels = new ChannelManager(this.db);
		this.permissions = new PermissionManager(this.db);
		this.users = new UserManager(this.db);
		this.messages = new MessageManager(this.db);
		this.whitelist = new WhitelistManager(this.db);
	}
}
