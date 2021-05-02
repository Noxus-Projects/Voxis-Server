import io, { Socket } from 'socket.io';
import http from 'http';

import Middleware from './middleware';
import User from '../models/user';

const avatarURL = (id: string, avatar: string) =>
	`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

export default class WebSocket {
	private io: io.Server;

	constructor(server: http.Server) {
		this.io = new io.Server(server);

		this.io.use(Middleware.authorize);
		this.io.on('connection', (client) => this.handleConnection(client));
	}

	private async handleConnection(client: Socket) {
		console.log(`Client with id '${client.id}' connected!`);

		const userData = client.handshake.auth.user;

		const user: User = {
			id: userData.id,
			name: userData.username,
			picture: avatarURL(userData.id, userData.avatar),
		};

		client.on('joinRoom', (data) => this.joinRoom(client, user, data));
		client.on('leaveRoom', (data) => this.leaveRoom(client, user, data));

		client.on('disconnect', () => {
			console.log(`Client with id '${client.id}' disconnected!`);
		});
	}

	private joinRoom(client: Socket, user: User, data: string): void {
		client.join(data);
		this.io.emit('joinedRoom', { room: data, user });
	}

	private leaveRoom(client: Socket, user: User, data: string): void {
		client.leave(data);
		this.io.emit('leftRoom', { room: data, user });
	}
}
