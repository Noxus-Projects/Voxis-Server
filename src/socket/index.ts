import io, { Socket } from 'socket.io';
import http from 'http';

import Middleware from './middleware';

export default class WebSocket {
	private io: io.Server;
	constructor(server: http.Server) {
		this.io = new io.Server(server);

		this.io.use(Middleware.authorize);
		this.io.on('connection', (client) => this.handleConnection(client));
	}

	private handleConnection(client: Socket) {
		console.log(`Client with id '${client.id}' connected!`);

		client.on('disconnect', () => {
			console.log(`Client with id '${client.id}' disconnected!`);
		});
	}
}
