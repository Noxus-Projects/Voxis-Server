import http, { IncomingMessage, ServerResponse } from 'http';

import IO from 'socket.io';
import Middleware from './middleware';

export default class Server {
	private http: http.Server;
	private io: IO.Server;

	constructor() {
		this.http = http.createServer(this.handleRequest);
		this.io = new IO.Server(this.http);

		this.io.on('connection', this.handleConnection);

		this.io.use(Middleware.authorize);
	}

	private handleConnection(client: IO.Socket) {
		console.log('Client connected!');

		client.on('disconnect', () => {
			console.log('Client disconnected!');
		});
	}

	private handleRequest(req: IncomingMessage, res: ServerResponse) {
		res.statusCode = 403;
		res.end();
	}

	public start(port: number) {
		this.http.listen(port, () => console.log(`Started server on port ${port}!`));
	}
}
