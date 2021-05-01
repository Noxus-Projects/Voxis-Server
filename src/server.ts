import express, { Express } from 'express';
import io, { Socket } from 'socket.io';
import http from 'http';

import Middleware from './middleware';
import API from './api';

export default class Server {
	private app: Express;
	private server: http.Server;
	private io: io.Server;

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);
		this.io = new io.Server(this.server);

		this.io.use(Middleware.authorize);
		this.io.on('connection', this.handleConnection);

		this.app.get('/login', API.login);

		this.app.use(API.notFound);
	}

	private handleConnection(client: Socket) {
		console.log('Client connected!');

		client.on('disconnect', () => {
			console.log('Client disconnected!');
		});
	}

	public start(port: number) {
		this.server.listen(port, () => console.log(`Started server on port ${port}!`));
	}
}
