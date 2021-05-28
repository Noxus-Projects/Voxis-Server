import { nanoid } from 'nanoid';

import Action, { ActionType } from '@models/action';
import { DB } from '@models/database';

export default class AuditManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	public add(options: { data: unknown; user: string; type: ActionType }): void {
		const id = nanoid();

		console.log(id);

		const action: Action = {
			...options,
			timestamp: Date.now(),
			id,
		};

		this.db.get('audit').push(action).write();
	}

	public remove(id: string): void {
		this.db
			.get('audit')
			.remove((audit) => audit.id === id)
			.write();
	}

	public get(options: { from: number; to: number }): Action[] | void {
		return this.db.get('audit').slice(options.from, options.to).value();
	}
}
