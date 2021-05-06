import { ClientOptions } from '.';

export default class RoomManager {
	private server;
	private client;
	private user;

	constructor(options: ClientOptions) {
		this.server = options.server;
		this.client = options.client;
		this.user = options.user;

		this.client.on('joinRoom', (data) => this.joinRoom(data));
		this.client.on('leaveRoom', (data) => this.leaveRoom(data));
	}

	private joinRoom(room: string): void {
		this.client.join(room);
		this.server.emit('joinedRoom', { room, user: this.user.id });
	}

	private leaveRoom(room: string): void {
		this.client.leave(room);
		this.server.emit('leftRoom', { room, user: this.user.id });
	}
}
