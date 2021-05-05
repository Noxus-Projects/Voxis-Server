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

	private joinRoom(data: string): void {
		this.client.join(data);
		this.server.emit('joinedRoom', { room: data, user: this.user.id });
	}

	private leaveRoom(data: string): void {
		this.client.leave(data);
		this.server.emit('leftRoom', { room: data, user: this.user.id });
	}
}
