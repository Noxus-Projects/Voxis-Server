import { Cache, CachedData } from '@models/database';

export default class CacheManager {
	private db: Cache;
	constructor(db: Cache) {
		this.db = db;
	}

	public get(token: string): CachedData | void {
		return this.db.get(token).value();
	}

	public set(token: string, id: string): void {
		this.db.set(token, { id, created: Date.now() }).write();
	}
}
