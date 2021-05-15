import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

import { Base } from '@utils/functions';
import { CacheSchema, DB, DatabaseSchema, Cache } from '@models/database';

import WhitelistManager from './whitelist';
import ChannelManager from './channel';
import MessageManager from './message';
import UserManager from './user';
import PermissionManager from './permission';
import CacheManager from './cache';
import AuditManager from './audit';

export default class Database {
	private db: DB;
	private cachedb: Cache;

	public channels: ChannelManager;
	public audit: AuditManager;
	public messages: MessageManager;
	public permissions: PermissionManager;
	public users: UserManager;
	public whitelist: WhitelistManager;
	public cache: CacheManager;

	constructor() {
		const dbAdapter = new FileSync<DatabaseSchema>(Base('/data/db.json'));
		this.db = low(dbAdapter);

		const cacheAdapter = new FileSync<CacheSchema>(Base('/data/cache.json'));
		this.cachedb = low(cacheAdapter);

		this.db.defaults({ channels: {}, users: {}, whitelist: [], messages: {}, audit: [] }).write();
		this.cachedb.defaults({ token: {} }).write();

		this.channels = new ChannelManager(this.db);
		this.audit = new AuditManager(this.db);
		this.permissions = new PermissionManager(this.db);
		this.users = new UserManager(this.db);
		this.messages = new MessageManager(this.db);
		this.whitelist = new WhitelistManager(this.db);
		this.cache = new CacheManager(this.cachedb);
	}
}
