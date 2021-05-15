import low from 'lowdb';

import { DbChannel, DbMessage } from '@models/channel';
import { DbUser } from '@models/user';
import { DbAction } from '@models/action';

export interface DatabaseSchema {
	channels: Record<string, DbChannel>;
	users: Record<string, DbUser>;
	whitelist: Array<string>;
	messages: Record<string, Array<DbMessage>>;
	audit: Array<DbAction>;
}

export interface CachedData {
	id: string;
	created: number;
}

export interface CacheSchema {
	token: Record<string, CachedData>;
}

export type DB = low.LowdbSync<DatabaseSchema>;
export type Cache = low.LowdbSync<CacheSchema>;
