import Action, { ActionType, DbAction } from '@models/action';

import { DB } from '@models/database';

export default class AuditManager {
	private db: DB;
	constructor(database: DB) {
		this.db = database;
	}

	public add(options: { data: unknown; user: string; type: ActionType }): void {
		const action: DbAction = {
			...options,
			timestamp: Date.now(),
		};

		this.db.get('audit').push(action).write();
	}

	public remove(id: string): void {
		this.db.get('audit').remove((action) => action.timestamp.toString() === id);
	}

	public get(id: string): Action | void {
		const action = this.db
			.get('audit')
			.find((action) => action.timestamp.toString() === id)
			.value();

		if (action)
			return {
				...action,
				id,
			};

		return;
	}
}
