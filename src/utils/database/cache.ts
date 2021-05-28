import { Cache, CachedData } from '@models/database';

export default class CacheManager {
	private db: Cache;
	constructor(db: Cache) {
		this.db = db;
	}

	public get(token: string): CachedData | void {
		return this.db.get('token').get(token).value();
	}

	public set(token: string, id: string): void {
		this.db.get('token').set(token, { id, created: Date.now() }).write();
	}

	public clear(): void {
		this.db.unset('token').write();
	}
}
