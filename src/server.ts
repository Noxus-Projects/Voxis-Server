import Database from '@utils/database';
import chalk from 'chalk';
import http from 'http';

import App from './app';
import Socket from './socket';

export default class Server {
	private http: http.Server;
	private app: App;
	private database: Database;

	constructor() {
		this.database = new Database();
		this.app = new App(this.database);
		this.http = http.createServer(this.app.server);
		new Socket(this.http, this.database);
	}

	public start(port: number): void {
		this.http.listen(port, () => console.log(chalk.yellow('WEB'), chalk.cyan(port)));
	}
}
