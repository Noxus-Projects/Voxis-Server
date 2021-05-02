import http from 'http';

import App from './app';
import Socket from './socket';

export default class Server {
	private http: http.Server;
	private app: App;
	private socket: Socket;

	constructor() {
		this.app = new App();
		this.http = http.createServer(this.app.server);
		this.socket = new Socket(this.http);
	}

	public start(port: number) {
		this.http.listen(port, () => console.log(`Started server on port ${port}!`));
	}
}
