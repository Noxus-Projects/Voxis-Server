import { Socket, Server } from 'socket.io';

import User from '../models/user';

const avatarURL = (id: string, avatar: string) =>
	`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

export default class Client {
	server;
	client;
	user: User;

	constructor(client: Socket, server: Server) {
		this.server = server;
		this.client = client;

		const userData = client.handshake.auth.user;

		this.user = {
			id: userData.id,
			name: userData.username,
			picture: avatarURL(userData.id, userData.avatar),
		};

		client.on('joinRoom', (data) => this.joinRoom(data));
		client.on('leaveRoom', (data) => this.leaveRoom(data));

		client.on('voice', (data) => this.handleVoice(data));
	}

	private handleVoice(data: string): void {
		this.client.rooms.forEach((room) =>
			this.client.to(room).emit('voice', { user: this.user, data })
		);
	}

	private joinRoom(data: string): void {
		this.client.join(data);
		this.server.emit('joinedRoom', { room: data, user: this.user });
	}

	private leaveRoom(data: string): void {
		this.client.leave(data);
		this.server.emit('leftRoom', { room: data, user: this.user });
	}
}
